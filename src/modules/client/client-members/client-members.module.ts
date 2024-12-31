import { Module } from '@nestjs/common';
import { ClientMembersService } from './client-members.service';
import { ClientMembersResolver } from './client-members.resolver';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entity/client-members.entity';
import { ClientMembersRepository } from './client-members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Members]), ],
  providers: [ClientMembersResolver, ClientMembersService, ClientMembersRepository],
  exports: [ClientMembersResolver, ClientMembersService],
})
export class ClientMembersModule {}
