import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';
import { ClientSubscriptionRepository } from './client-subscription/client-subscription.repository';


@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly clientSubscriptionRepository: ClientSubscriptionRepository,
  ) {}
  async createClient(createClientInput: CreateClientInput): Promise<Client> {
    return this.clientRepo.createClient(createClientInput);
  }

  async getAllClients(
    search: string, 
    offset: number,
    limit: number,
  ): Promise<Client[]> {
    const queryBuilder = this.clientRepo.createQueryBuilder('client')
          .leftJoinAndSelect('client.users', 'clientUsers')
          .where('client.isApproved = :isApproved', { isApproved: 'APPROVED' });
    if (search) {
      queryBuilder.andWhere('client.clientName like :search', {
        search: `%${search}%`,
      });
    }
    queryBuilder.orderBy('client.updatedAt', 'DESC');
    if (offset) {
      queryBuilder.offset(offset);
    }
    if (limit) {
      queryBuilder.limit(limit);
    }
    return queryBuilder.getMany();
  }

  async getClientById(id: string): Promise<Client> {
    if (!id) {
      throw new Error('Client ID is required');
    }
    const client = await this.clientRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.users', 'clientUsers')
      .where('client.clientId = :id', { id })
      .andWhere('clientUsers.isPrimary = false')
      .getOne();

    const clientSubscription = await this.clientSubscriptionRepository
      .createQueryBuilder('clientSubscription')
      .select('clientSubscription')
      .where('clientSubscription.planName = :planName', { planName: client.planType })
      .getOne();

    client['clientSubscription'] = clientSubscription;

     return client; 
  }

  async updateClient(
    clientId: string,
    updateClientInput: UpdateClientInput,
  ): Promise<string> {
    delete updateClientInput.clientId;
    const result = await this.clientRepo.update(clientId, {
      isApproved: updateClientInput.isApproved,
      isActive: updateClientInput.isActive,
    });
    if (result.affected === 0) {
      throw new Error('Client not found');
    }
    return 'Client updated successfully';
  }

  async getClientApprovalList(
    search: string, 
    offset: number,
    limit: number,
  ): Promise<Client[]> {
    const queryBuilder = this.clientRepo.createQueryBuilder('client')
          .leftJoinAndSelect('client.users', 'clientUsers')
          .where('client.isApproved IN (:...isApproved)', { isApproved: ['PENDING', 'REJECTED'] });
    if (search) {
      queryBuilder.andWhere('client.clientName like :search', {
        search: `%${search}%`,
      });
    }
    queryBuilder.orderBy('client.updatedAt', 'DESC');
    if (offset) {
      queryBuilder.offset(offset);
    }
    if (limit) {
      queryBuilder.limit(limit);
    }
    return queryBuilder.getMany();
  }
}
