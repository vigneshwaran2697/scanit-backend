import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';


@Injectable()
export class ClientService {
  constructor(private readonly clientRepo: ClientRepository) {}
  async createClient(createClientInput: CreateClientInput): Promise<Client> {
    return this.clientRepo.createClient(createClientInput);
  }

  async getAllClients(
    search: string, 
    offset: number,
    limit: number,
  ): Promise<Client[]> {
    const queryBuilder = this.clientRepo.createQueryBuilder('client')
          .leftJoinAndSelect('client.users', 'clientUsers');
    if (search) {
      queryBuilder.where('client.clientName like :search', {
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
    return this.clientRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.users', 'clientUsers')
      .where('client.clientId = :id', { id })
      .getOne();
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
}
