import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { CognitoModule } from 'src/aws/cognito/cognito.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../utils/jwt-constants';
import { UserRepository } from './user.repository';
import { SesModule } from 'src/aws/ses/ses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiry },
    }),
    CognitoModule,
    SesModule,
  ],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService, TypeOrmModule.forFeature([User]), UserRepository],
})
export class UserModule {}
