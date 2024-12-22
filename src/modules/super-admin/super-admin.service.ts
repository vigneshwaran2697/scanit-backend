import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { User, UserRole } from '../user/entities/user.entity';
import { CognitoService } from 'src/aws/cognito/cognito.service';
import { CreateSuperAdminInput } from '../user/dto/create-user.input';
import { UnauthenticatedException } from 'src/utils/exceptions/unauthenticated.exception';

@Injectable()
export class SuperAdminService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly cognitoService: CognitoService
    ){}

    public async createSuperAdmin(createSuperAdminInput: CreateSuperAdminInput): Promise<User> {
        const { emailId, password, firstName, lastName } = createSuperAdminInput;
        let cognitoResp: any, username: string;
        const user = await this.userRepo.findByEmail(emailId);
        if (user) {
          throw new UnauthenticatedException('User already exist');
        }
        try {
          cognitoResp = await this.cognitoService.createUserInCognito({
            emailId,
            password,
            userAttributes: [
              { Name: 'email', Value: emailId },
              {
                Name: 'name',
                Value: `${firstName} ${lastName}`,
              },
              { Name: 'custom:firstname', Value: firstName },
              { Name: 'custom:lastname', Value: lastName },
            ],
          });
          username = cognitoResp?.UserSub;
        } catch (error) {
          console.log('Cognito Super Admin User Creation Error: ', error);
          try {
            cognitoResp = await this.cognitoService.getUserFromCognito(emailId);
            username = cognitoResp.Username;
            console.log(username);
          } catch (err) {
            console.log('Cognito Super Admin User Fetch Error: ', err);
          }
        }
        if (username) {
          const userInput: any = {
            username,
            emailId,
            firstName,
            lastName,
            isActive: true,
            userRole: UserRole.SUPER_ADMIN,
          };
          return this.userRepo.createRecord(userInput);
        }
      }  
}
