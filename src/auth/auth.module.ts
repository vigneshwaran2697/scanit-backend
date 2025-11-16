import { UserModule } from '../modules/user/user.module'
import { CognitoModule } from '../aws/cognito/cognito.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConfiguration } from './auth.configuration';
import { CognitoAuthGuard } from './guards/cognito.guard';
import { JwtStrategy } from './jwt.strategy';
import { SsmModule } from '../aws/ssm/ssm.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CognitoModule,
    UserModule,
    SsmModule,
  ],
  providers: [AuthConfiguration, CognitoAuthGuard, JwtStrategy],
})
export class AuthModule {}
