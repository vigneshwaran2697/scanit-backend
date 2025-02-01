import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientRepository } from './client.repository';
import { UserRepository } from '../user/user.repository';
import { CognitoService } from 'src/aws/cognito/cognito.service';
import { ClientMembersModule } from './client-members/client-members.module';
import { ClientSubscriptionModule } from './client-subscription/client-subscription.module';
import { SesService } from 'src/aws/ses/ses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), ClientMembersModule, ClientSubscriptionModule],
  providers: [ClientResolver, ClientService, ClientRepository, UserRepository, CognitoService, SesService],
  exports: [ClientService, ClientRepository]
})
export class ClientModule {}
