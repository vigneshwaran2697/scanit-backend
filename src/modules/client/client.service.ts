import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';
import { SesService } from 'src/aws/ses/ses.service';
import { CognitoService } from 'src/aws/cognito/cognito.service';
import { ClientSubscriptionRepository } from './client-subscription/client-subscription.repository';


@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly mailService: SesService,
    private readonly cognitoService: CognitoService,
    private readonly clientSubscriptionRepo: ClientSubscriptionRepository,

  ) {}
  async createClient(createClientInput: CreateClientInput): Promise<Client> {
    return this.clientRepo.createClient(createClientInput);
  }

  async getAllClients(
    search: string, 
    offset: number,
    limit: number,
  ): Promise<Client[]> {
    const queryBuilder = await this.clientRepo.query(`
      SELECT 
        "client"."c_id" AS "clientId", 
        "client"."c_name" AS "clientName", 
        "client"."c_email_id" AS "clientEmailId", 
        "client"."c_is_active" AS "isActive", 
        "client"."c_created_at" AS "createdAt", 
        "client"."c_updated_at" AS "updatedAt", 
        "client"."c_user_limit" AS "userLimit",
        "client"."c_address" AS "Address",
        (
          SELECT 
            COUNT(*) 
          FROM 
            members 
          WHERE 
            "client"."c_id" = members.client_id
        )::INTEGER AS "userCreated" 
      FROM 
        "client" "client" 
      WHERE 
        ("client"."c_is_approved" = 'APPROVED') 
        AND ("client"."c_deleted_at" IS NULL) 
      ORDER BY 
        "updatedAt" DESC 
      `)
      
    console.log(queryBuilder);
      
    return queryBuilder;
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

      const planName = await this.clientSubscriptionRepo.findOneBy({ id: client?.planType });
      
      if (planName) {
        client.planType = planName?.planName ? planName.planName : client.planType
      }
      return client;
  }

  async updateClient(
    clientId: string,
    updateClientInput: UpdateClientInput,
  ): Promise<string> {
    try {
      delete updateClientInput.clientId;
      const client = await this.clientRepo.createQueryBuilder('client')
            .select(['client.clientId', 'client.clientName', 'client.clientEmailId', 'client.isApproved'])
            .where('client.clientId = :id', { id: clientId })
            .getOne();
      
      if (!client) {
        throw new Error('Client not found');
      }
      await this.clientRepo.update(clientId, {
        isApproved: updateClientInput.isApproved,
        isActive: updateClientInput.isActive,
        rejectedReason: updateClientInput.rejectedReason,
      });

      if (
        updateClientInput.isApproved === 'REJECTED' &&
        client.isApproved === 'PENDING' &&
        client.clientEmailId?.length
      ) {
        let mailBody = `Hi ${client.clientName},\n\nGreetings from Idcheck team. The Client created with email ${client.clientEmailId} has been rejected by admin. For additional information contact Idcheck team.\n\nRegards,\nTeam Idcheck.`;

        if (updateClientInput?.rejectedReason) {
          mailBody =
            mailBody +
            `\n\nRejected Reason: ${updateClientInput.rejectedReason}`;
        }

        await this.mailService.sendEmail(
          `${client.clientEmailId}`,
          'Scanit Client Rejected!',
          mailBody,
        );
      }
  
      if (
        updateClientInput.isApproved === 'APPROVED' &&
        client.isApproved === 'PENDING' &&
        client.clientEmailId?.length
      ) {
        await this.cognitoService.confirmCognitoUser(client.clientEmailId);
        await this.mailService.sendEmail(
          `${client.clientEmailId}`,
          'Scanit Client Approved',
          `Hi ${client.clientName},\n\nGreetings from Idcheck team. The Client created with email ${client.clientEmailId} is successfully approved by admin. \n please login as client to https://www.idcheck.co.in/client/login. \n\nRegards,\nTeam Idcheck.`,
        );
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
