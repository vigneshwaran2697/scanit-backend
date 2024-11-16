import { Injectable } from '@nestjs/common';
import { config as configData } from '../../config/config';
import { User, UserRole } from './entities/user.entity';
import { CognitoService } from '../../aws/cognito/cognito.service';
import { UserRepository } from './user.repository';
import { UnauthenticatedException } from '../../utils/exceptions/unauthenticated.exception';
const config = configData[process.env.NODE_ENV || 'development'];

// SuperAdmin user
const SUPERADMIN_FIRST_NAME = 'ScanIt';
const SUPERADMIN_LAST_NAME = 'SuperAdmin';

@Injectable()
export class UserService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly userRepo: UserRepository,
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
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select('user')
      .where('user.emailId = :emailId', { emailId })
      .getOne();
    if (!user) {
      throw new UnauthenticatedException(`User not exist`);
    }
    return user;
  }

  public async singIn(
    emailId: string,
    password: string,
    isTPVAdminSignIn = false,
  ): Promise<string> {
    await this.getUserByEmailId(emailId);
    return this.cognitoService.performAuth(emailId, password);
  }
}
