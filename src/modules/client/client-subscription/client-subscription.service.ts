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

  public async getAllClientSubscription() {
    return this.clientSubscripRepo.createQueryBuilder('clientSubscription').getMany();
  }

  public async getAllClientSubscriptionBySuperAdmin() {
    return this.clientSubscripRepo.createQueryBuilder('clientSubscription').getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} clientSubscription`;
  }

  update(id: number, updateClientSubscriptionInput: UpdateClientSubscriptionInput) {
    return `This action updates a #${id} clientSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientSubscription`;
  }
}
