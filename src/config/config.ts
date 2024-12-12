const commonConfig = {
    region: 'ap-south-1',
    cognitoParamName: '/cognito',
    dbParamName: '/db-config',
    appConfig: '/app-config',
  };
  
  export const config = {
    development: {
      ...commonConfig,
    },
    qa: {
      ...commonConfig,
      attachmentsBucketName: 'tpv-attachments-test',
    },
    production: {
      ...commonConfig,
      attachmentsBucketName: 'tpv-attachments-prod',
    },
  };
  
  export const forgotPassordUrlConfig = '/new-password?key=';
  
  export const accountActivationUrl = '/account-activation';
  
  export const loginUrlConfig = '/login';
  