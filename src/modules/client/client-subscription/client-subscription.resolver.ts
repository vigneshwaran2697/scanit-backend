import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientSubscriptionService } from './client-subscription.service';
import { CreateClientSubscriptionInput } from './dto/create-client-subscription.input';
// import { UpdateClientSubscriptionInput } from './dto/update-client-subscription.input';
import { ClientSubscription } from './entities/client-subscription.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { UserRoles } from 'src/utils/app-constants';
import { String } from 'aws-sdk/clients/apigateway';
import { UpdateClientSubscriptionInput } from './dto/update-client-subscription.input';

@Resolver(() => ClientSubscription)
export class ClientSubscriptionResolver {
  constructor(private readonly clientSubscriptionService: ClientSubscriptionService) {}

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Mutation(() => ClientSubscription)
  createClientSubscription(@Args('createClientSubscriptionInput') createClientSubscriptionInput: CreateClientSubscriptionInput) {
    return this.clientSubscriptionService.createClientSubscription(createClientSubscriptionInput);
  }

  @Query(() => [ClientSubscription])
  public async getAllClientSubscription(): Promise<ClientSubscription[]> {
    return this.clientSubscriptionService.getAllClientSubscription();
  }

  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => [ClientSubscription])
  async getAllClientSubscriptionBySuperAdmin(): Promise<ClientSubscription[]> {
    return this.clientSubscriptionService.getAllClientSubscriptionBySuperAdmin();
  }


  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Query(() => ClientSubscription)
  findOne(@Args('id') id: string): Promise<ClientSubscription> {
    return this.clientSubscriptionService.getOneSubscriptions(id);
  }


  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER_ADMIN)
  @Mutation(() => String)
  updateSubscriptions(@Args('updateClientSubscriptionInput') updateClientSubscriptionInput: UpdateClientSubscriptionInput): Promise<String> {
    return this.clientSubscriptionService.updateSubscriptions(updateClientSubscriptionInput);
  }

  // @Mutation('updateClientSubscription')
  // update(@Args('updateClientSubscriptionInput') updateClientSubscriptionInput: UpdateClientSubscriptionInput) {
  //   return this.clientSubscriptionService.update(updateClientSubscriptionInput.id, updateClientSubscriptionInput);
  // }

  // @Mutation('removeClientSubscription')
  // remove(@Args('id') id: number) {
  //   return this.clientSubscriptionService.remove(id);
  // }
}
