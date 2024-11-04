import { UserModule } from '../modules/user/user.module'
import { CognitoModule } from '../aws/cognito/cognito.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConfiguration } from './auth.configuration';
import { CognitoAuthGuard } from './guards/cognito.guard';
import { JwtStrategy } from './jwt.strategy';
import { SsmModule } from '../aws/ssm/ssm.module';
import { UserService } from '../modules/user/user.service';
import { UserRepository } from '../modules/user/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CognitoModule,
    UserModule,
    SsmModule,
  ],
  providers: [AuthConfiguration, CognitoAuthGuard, JwtStrategy, UserService, UserRepository],
})
export class AuthModule {}
