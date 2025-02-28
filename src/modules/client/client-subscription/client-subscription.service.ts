import { Injectable } from '@nestjs/common';
import { CreateClientSubscriptionInput } from './dto/create-client-subscription.input';
import { UpdateClientSubscriptionInput } from './dto/update-client-subscription.input';
import { ClientSubscription } from './entities/client-subscription.entity';
import { ClientSubscriptionRepository } from './client-subscription.repository';

@Injectable()
export class ClientSubscriptionService {
  constructor(
    private readonly clientSubscripRepo: ClientSubscriptionRepository,
  ) {}

  async createClientSubscription(createClientSubscriptionInput: CreateClientSubscriptionInput): Promise<ClientSubscription> {
    return this.clientSubscripRepo.save(createClientSubscriptionInput);
  }

  public async getAllClientSubscription(): Promise<ClientSubscription[]> {
    return this.clientSubscripRepo.createQueryBuilder('clientSubscription').getMany();
  }

  public async getAllClientSubscriptionBySuperAdmin(): Promise<ClientSubscription[]> {
    return this.clientSubscripRepo.createQueryBuilder('clientSubscription').getMany();
  }

  async getOneSubscriptions(id: string): Promise<ClientSubscription> {
    return this.clientSubscripRepo.createQueryBuilder('clientSubscription').where('clientSubscription.id = :id', { id }).getOne();
  }

  async updateSubscriptions(updateSubscriptionsInput: UpdateClientSubscriptionInput): Promise<string> {
    try{
      const id = updateSubscriptionsInput.id;
      delete updateSubscriptionsInput.id;
      await this.clientSubscripRepo.update(
        { id }, {
          ...updateSubscriptionsInput
        });
      return 'Updated';
    } catch (err) {
      console.log(`Error in updateSubscriptions: ${err}`);
      
    }
  }
}
