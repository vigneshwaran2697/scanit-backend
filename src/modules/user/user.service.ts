import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { config as configData } from '../../config/config';
import { User, UserRole } from './entities/user.entity';
import { CognitoService } from '../../aws/cognito/cognito.service';
import { UserRepository } from './user.repository';
import { UnauthenticatedException } from '../../utils/exceptions/unauthenticated.exception';
import { JwtService } from '@nestjs/jwt';
import { forgotPassordUrlConfig } from '../../config/config';
const config = configData[process.env.NODE_ENV || 'development'];
import { SesService } from 'src/aws/ses/ses.service';


// SuperAdmin user
const SUPERADMIN_FIRST_NAME = 'ScanIt';
const SUPERADMIN_LAST_NAME = 'SuperAdmin';

@Injectable()
export class UserService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: SesService
  ) {}

  public async createSuperAdminUser() {
    const adminEmailId = config.appConfig.superAdminEmailId;
    let adminUser = await this.userRepo.findOneByCond({
      emailId: adminEmailId,
    });
    if (!adminUser) {
      let cognitoResp, username;
      try {
        cognitoResp = await this.cognitoService.createUserInCognito({
          emailId: adminEmailId,
          password: config.appConfig.superAdminPassword,
          userAttributes: [
            { Name: 'email', Value: adminEmailId },
            {
              Name: 'name',
              Value: `${SUPERADMIN_FIRST_NAME} ${SUPERADMIN_LAST_NAME}`,
            },
            { Name: 'custom:firstname', Value: SUPERADMIN_FIRST_NAME },
            { Name: 'custom:lastname', Value: SUPERADMIN_LAST_NAME },
          ],
        });
        username = cognitoResp?.UserSub;
      } catch (error) {
        console.log('Cognito Super Admin User Creation Error: ', error);
        try {
          cognitoResp =
            await this.cognitoService.getUserFromCognito(adminEmailId);
          username = cognitoResp.Username;
          console.log(username);
        } catch (err) {
          console.log('Cognito Super Admin User Fetch Error: ', err);
        }
      }
      if (username) {
        const userInput: any = {
          username,
          emailId: adminEmailId,
          firstName: SUPERADMIN_FIRST_NAME,
          lastName: SUPERADMIN_LAST_NAME,
          isActive: true,
          userRole: UserRole.SUPER_ADMIN,
        };
        adminUser = await this.userRepo.createRecord(userInput);
      }
    }
    return adminUser;
  }

  public async getUserByUserName(userName: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.username = :userName', {
        userName,
      })
      .getOne();
    if (!user) {
      throw new UnauthenticatedException(`User not exist`);
    } else if (user?.userRole !== UserRole.SUPER_ADMIN) {
      if (!user?.isActive) {
        throw new UnauthenticatedException('User is Disabled');
      }
    }
    return user;
  }

  public async getUserByEmailId(emailId: string): Promise<User> {
    const user = await this.userRepo.findByEmail(emailId);
    if (!user) {
      throw new UnauthenticatedException(`User not exist`);
    }
    return user;
  }

  public async singIn(emailId: string, password: string): Promise<string> {
    await this.getUserByEmailId(emailId);
    return this.cognitoService.performAuth(emailId, password);
  }

  /* -------------------- Forgot Password Flow -------------------- */
  public async sendForgotPasswordMail(emailId: string): Promise<string> {
    emailId = emailId.toLowerCase();
    const user = await this.getUserByEmailId(emailId);
    if (user && !user.isActive) {
      throw new UnauthenticatedException('User account is not active.');
    }
    const payload = { emailId: user.emailId, id: user.id };
    const token = this.jwtService.sign(payload);
    await this.userRepo.updateByObj(user, { resetPwdToken: token });

    // Build reset link using optional APP_DOMAIN env (frontend can handle token if domain absent)
    const appDomain = process.env.APP_DOMAIN || '';
    const resetLink = `${appDomain}${forgotPassordUrlConfig}${token}`;

    try {
      await this.mailService.sendEmail(
        user.emailId,
        'Reset your password',
        `Hello ${user.firstName || ''},\n\nYou requested a password reset. Click the link below (or paste into browser):\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.`
      );
    } catch (e) {
      console.log('Forgot password email error', e);
      throw new InternalServerErrorException('Error sending reset password email');
    }
    return 'Email Sent Successfully!';
  }

  public async verifyResetPasswordToken(token: string, resetPwdToken = false): Promise<string> {
    try {
      const payload: any = this.jwtService.verify(token);
      if (payload && payload.emailId) {
        const user = await this.getUserByEmailId(payload.emailId);
        if (user.resetPwdToken === token) {
          if (resetPwdToken) {
            await this.userRepo.updateByObj(user, { resetPwdToken: null });
            return user.emailId;
          }
          return 'Verified Successfully';
        }
      }
      throw new BadRequestException('Reset Password link is invalid or expired');
    } catch (e) {
      throw new BadRequestException('Reset Password link is invalid or expired');
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<string> {
    const emailId = await this.verifyResetPasswordToken(token, true);
    const user = await this.getUserByEmailId(emailId);
    try {
      await this.cognitoService.cognitoSetPassword(user.username, newPassword);
    } catch (e) {
      console.log('Cognito password reset error', e);
      throw new InternalServerErrorException('Unable to reset password');
    }
    return 'Password Reset Successfully';
  }

}
