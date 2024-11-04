import { UserRole } from '../../modules/user/entities/user.entity';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { config as configData } from '../../config/config';

const config = configData[process.env.NODE_ENV || 'development'];

export class CognitoService {
  public static cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
    region: config.region,
  });

  public static userPool;
  private readonly sns: AWS.SNS;

  constructor() {
    AWS.config.update({
      region: config.region,
    });
    this.sns = new AWS.SNS();
  }
  public async performAuth(emailId: string, password: string): Promise<string> {
    const userObj = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: config.appConfig.ClientId,
      AuthParameters: {
        USERNAME: emailId,
        PASSWORD: password,
      },
    };
    return CognitoService.cognitoIdentity
      .initiateAuth(userObj)
      .promise()
      .then((token) => {
        console.log(token);
        return (
          token &&
          token.AuthenticationResult &&
          token.AuthenticationResult.AccessToken
        );
      });
  }

  public async createUserInCognito(args) {
    const params = {
      ClientId: config.appConfig.ClientId,
      Password: args.password,
      Username: args.emailId,
      UserAttributes: args.userAttributes,
    };
    const params1: any = {
      UserPoolId: config.appConfig.PoolId,
      Username: args.emailId,
    };
    const data = await CognitoService.cognitoIdentity.signUp(params).promise();
    try {
      await CognitoService.cognitoIdentity
        .adminConfirmSignUp(params1)
        .promise();
    } catch (error) {
      console.log('Cognito User Confirm Error------', error);
    }
    if (args.groupName) {
      params1.GroupName = args.groupName;
      setTimeout(function () {
        CognitoService.cognitoIdentity.adminAddUserToGroup(params1).promise();
      }, 2000);
    }
    return data;
  }

  public async getUserFromCognito(userName) {
    const params: any = {
      UserPoolId: config.appConfig.PoolId,
      Username: userName,
    };
    return CognitoService.cognitoIdentity.adminGetUser(params).promise();
  }

  public async getUserFromCognitoByEmail(emailId) {
    const params: any = {
      UserPoolId: config.appConfig.PoolId,
      Username: emailId,
    };
    return CognitoService.cognitoIdentity
      .adminGetUser(params)
      .promise()
      .catch(() => {
        return '';
      });
  }

  public async deleteUserInCognito(userName: string) {
    const params = {
      UserPoolId: config.appConfig.PoolId,
      Username: userName,
    };
    await CognitoService.cognitoIdentity.adminDeleteUser(params).promise();
  }

  public async cognitoSetPassword(userName: string, newPassword: string) {
    const params = {
      Password: newPassword,
      UserPoolId: config.appConfig.PoolId,
      Username: userName,
      Permanent: true,
    };

    return new Promise((resolve, reject) => {
      CognitoService.cognitoIdentity.adminSetUserPassword(
        params,
        (err, data) => {
          if (err) {
            console.log(err, err.stack);
            console.log('Error is ' + err.message);
            reject(err.message);
          } else {
            // successful response
            console.log(data);
            resolve('Success');
          }
        },
      );
    });
  }

  public async updateEmailInCognito(userName: string, emailId: string) {
    const params = {
      UserPoolId: config.appConfig.PoolId,
      Username: userName,
      UserAttributes: [
        {
          Name: 'email',
          Value: emailId,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      CognitoService.cognitoIdentity.adminUpdateUserAttributes(
        params,
        (err, data) => {
          if (err) {
            console.log(err, err.stack);
            console.log('Error is ' + err.message);
            reject(err.message);
          } else {
            // successful response
            console.log(data);
            resolve('Success');
          }
        },
      );
    });
  }

  public async adminConfirmSignUp(emailId: string) {
    const params = {
      UserPoolId: config.appConfig.PoolId,
      Username: emailId,
    };
    try {
      await CognitoService.cognitoIdentity.adminConfirmSignUp(params).promise();
    } catch (e) {
      console.log(e);
    }
  }

  public async addUserToGroup(emailId: string, groupName: UserRole) {
    const params1: any = {
      UserPoolId: config.appConfig.PoolId,
      Username: emailId,
      GroupName: groupName,
    };
    try {
      await CognitoService.cognitoIdentity
        .adminAddUserToGroup(params1)
        .promise();
    } catch (e) {
      console.log(e);
    }
  }

  public async addSqsQueue(sqsUserData) {
    const sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: config.region,
    });
    return sqs.sendMessage(sqsUserData).promise();
  }

  public async cognitoChangePassword(userName, oldPassword, newPassword) {
    const authenticationData = {
      Username: userName,
      Password: oldPassword,
    };

    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
      Username: userName,
      Pool: CognitoService.userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise(function (resolve, reject) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (res) => {
          console.log('*** User authenticated to change password', res);
          cognitoUser.changePassword(
            oldPassword,
            newPassword,
            function (err, result) {
              if (err) {
                console.log(err.message || JSON.stringify(err));
                return;
              }
              console.log('call result: ' + result);
              resolve('Success');
            },
          );
        },
        onFailure: (err) => {
          console.log('Inside Fail');
          console.log(err);
          reject('Invalid Old Password');
        },
      });
    });
  }

  async sendSMS(
    phoneNumber: string,
    message: string,
  ): Promise<AWS.SNS.PublishResponse> {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };
    return this.sns.publish(params).promise();
  }
}
