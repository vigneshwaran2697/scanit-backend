import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/utils/app-constants';
import { UseGuards } from '@nestjs/common';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Client } from './entities/client.entity';
import { ClientListResponse } from './entities/clientList.objectType';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  async createClient(@Args('createClientInput') createClientInput: CreateClientInput): Promise<Client> {
    return this.clientService.createClient(createClientInput);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => [ClientListResponse], { name: 'getAllclients' })
  async findAll(
    @Args('search', { type: () => String, nullable: true }) search: string,
    @Args('offset', { type: () => Number, nullable: true }) offset: number,
    @Args('limit', { type: () => Number, nullable: true }) limit: number,
  ) {
    return this.clientService.getAllClients(search, offset, limit);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => Client, { name: 'getClient' })
  async findOne(@Args('id') id: string) {
    return this.clientService.getClientById(id);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Mutation(() => String, { name: 'updateClient' })
  update(@Args('updateClientInput') updateClientInput: UpdateClientInput): Promise<string> {
    return this.clientService.updateClient(updateClientInput.clientId, updateClientInput);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => [Client], { name: 'getClientApprovalList' })
  async getClientApprovalList(
    @Args('search', { type: () => String, nullable: true }) search: string,
    @Args('offset', { type: () => Number, nullable: true }) offset: number,
    @Args('limit', { type: () => Number, nullable: true }) limit: number,
  ) {
    return this.clientService.getClientApprovalList(search, offset, limit);
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => [Client], { name: 'getClientRejectedList' })
  async getClientRejectedList(
    @Args('search', { type: () => String, nullable: true }) search: string,
    @Args('offset', { type: () => Number, nullable: true }) offset: number,
    @Args('limit', { type: () => Number, nullable: true }) limit: number,
  ) {
    return this.clientService.getClientRejectedList(search, offset, limit);
  }


  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => String, { name: 'updatePlanType' })
  async updatePlanType(
  ) {
    return this.clientService.updatePlanType();
  }



  // @UseGuards(CognitoAuthGuard, RolesGuard)
  // @Roles(UserRoles.ADMIN)
  // @Mutation('removeClient')
  // remove(@Args('id') id: number) {
  //   return this.clientService.remove(id);
  // }
}
