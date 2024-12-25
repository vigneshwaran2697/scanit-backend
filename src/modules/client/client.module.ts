import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientRepository } from './client.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientResolver, ClientService, ClientRepository, UserRepository],
  exports: [ClientService, ClientRepository]
})
export class ClientModule {}
