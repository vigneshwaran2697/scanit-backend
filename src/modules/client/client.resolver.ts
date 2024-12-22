import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/utils/app-constants';
import { UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@Resolver('Client')
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation('createClient')
  create(@Args('createClientInput') createClientInput: CreateClientInput) {
    return this.clientService.create(createClientInput);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Query('client')
  findAll() {
    return this.clientService.findAll();
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Query('client')
  findOne(@Args('id') id: number) {
    return this.clientService.findOne(id);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation('updateClient')
  update(@Args('updateClientInput') updateClientInput: UpdateClientInput) {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation('removeClient')
  remove(@Args('id') id: number) {
    return this.clientService.remove(id);
  }
}
