import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';
import { SesService } from 'src/aws/ses/ses.service';


@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly mailService: SesService,

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
    return this.clientRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.users', 'clientUsers')
      .where('client.clientId = :id', { id })
      .andWhere('clientUsers.isPrimary = false')
      .getOne();
  }

  async updateClient(
    clientId: string,
    updateClientInput: UpdateClientInput,
  ): Promise<string> {
    try {
      delete updateClientInput.clientId;
      const client = await this.getClientById(clientId);
      
      if (!client) {
        throw new Error('Client not found');
      }
      await this.clientRepo.update(clientId, {
        isApproved: updateClientInput.isApproved,
        isActive: updateClientInput.isActive,
      });

      if (updateClientInput.isApproved === 'REJECTED' && client.isApproved === 'PENDING') {
        // send email to client
        const _data = await this.mailService.sendEmail(
          `${client.clientEmailId}`,
          'Scanit Client Rejected!',
          `Hi ${client.clientName},\n\nGreetings from Idcheck team. The Client created with email ${client.clientEmailId} has been rejected by admin. For additional information contact Idcheck team.\n\nRegards,\nTeam Idcheck.`,
        );
        console.log(`Email sent to client: ${_data}`);
        
      }
  
      if (updateClientInput.isApproved === 'APPROVED' && client.isApproved === 'PENDING') {
        // send email to client
        const _data = await this.mailService.sendEmail(
          `${client.clientEmailId}`,
          'Scanit Client Approved',
          `Hi ${client.clientName},\n\nGreetings from Idcheck team. The Client created with email ${client.clientEmailId} is successfully approved by admin. \n please login as client to https://www.idcheck.co.in/client/login. \n\nRegards,\nTeam Idcheck.`,
        );
        console.log(`Email sent to client: ${_data}`);
      }
    } catch(e) {
      console.log(`Error in sending email to client: ${e}`);
      
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
          .where('client.isApproved IN (:...isApproved)', { isApproved: ['PENDING'] });
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

  async getClientRejectedList(
    search: string, 
    offset: number,
    limit: number,
  ) {
      const queryBuilder = this.clientRepo.createQueryBuilder('client')
      .leftJoinAndSelect('client.users', 'clientUsers')
      .where('client.isApproved IN (:...isApproved)', { isApproved: ['REJECTED'] });
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
