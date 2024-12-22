import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminResolver } from './super-admin.resolver';
import { UserModule } from '../user/user.module';
import { CognitoModule } from 'src/aws/cognito/cognito.module';

@Module({
  imports: [CognitoModule, UserModule ],
  providers: [SuperAdminResolver, SuperAdminService],
})
export class SuperAdminModule {}
