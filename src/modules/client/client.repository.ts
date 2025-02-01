import { BaseRepository } from 'src/database/base.respoitory';
import { Client } from './entities/client.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UserRepository } from '../user/user.repository';
import { Transactional } from 'typeorm-transactional';
import { UserRole } from '../user/entities/user.entity';
import { CognitoService } from 'src/aws/cognito/cognito.service';
import { AES, enc } from 'crypto-js';
import { SesService } from 'src/aws/ses/ses.service';
@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepo: UserRepository,
    private readonly cognitoService: CognitoService,
    private readonly mailService: SesService,
  ) {
    super(Client, dataSource.createEntityManager());
  }

  getDecryptedPassword(password: string): string {
    if (password && password.length) {
      let decryptedData = AES.decrypt(password, 'gDdoxYdfT5XCJw0y');
      // console.log(decryptedData.toString(enc.Utf8));
      return decryptedData.toString(enc.Utf8);
    }
  }

  @Transactional()
  public async createClient(
    createClientInput: CreateClientInput,
  ): Promise<Client> {
    try {
      const isExistingClient = await this.userRepo.findByEmail(
        createClientInput?.clientEmailId,
      );
      if (isExistingClient) {
        throw new Error('Client Email already exists');
      }
      const client = await this.save({
        clientName: createClientInput.clientName,
        clientEmailId: createClientInput.clientEmailId,
        userLimit: createClientInput.userLimit,
        isActive: createClientInput.isActive,
        Address: createClientInput.Address,
        city: createClientInput.city,
        zipCode: createClientInput.zipCode,
        gstDocument: createClientInput.gstDocument,
        gstNumber: createClientInput.gstNumber,
        state: createClientInput.state,
        country: createClientInput.country,
        planType: createClientInput.planType,
      });
      const password = this.getDecryptedPassword(
        createClientInput.passwordHash,
      );
      //Client cognito creation
      const cognitoResp = await this.cognitoService.createUserInCognito({
        emailId: createClientInput.clientEmailId,
        password: createClientInput.passwordHash,
        userAttributes: [
          { Name: 'email', Value: createClientInput.clientEmailId },
          {
            Name: 'name',
            Value: `${createClientInput.clientName}`,
          },
          { Name: 'custom:firstname', Value: createClientInput.clientName },
          { Name: 'custom:lastname', Value: '' },
        ],
      });
      const username = cognitoResp?.UserSub;
      await this.userRepo.save({
        emailId: createClientInput.clientEmailId,
        username: username,
        firstName: createClientInput.clientName,
        lastname: '',
        phoneNumber: createClientInput.clientPhone,
        order: 0,
        isPrimary: true,
        clientId: client.clientId,
        userRole: UserRole.ADMIN,
      });

      const _data = await this.mailService.sendEmail(
        'teamscanit@gmail.com',
        'New Client Created',
        `Hi SuperAdmin,\n\nNew Client Created with email ${createClientInput.clientEmailId} and waiting for approval\n\nRegards,\nTeam Scanit`,
      );
      console.log(_data);
      
      //Client user creation
      for (const clientUser of createClientInput.clientContactInputs) {
        await this.userRepo.save({
          emailId: clientUser.emailId,
          phoneNumber: clientUser.phoneNumber,
          designation: clientUser.designation,
          firstName: clientUser.name,
          order: clientUser.order,
          isPrimary: false,
          clientId: client.clientId,
          userRole: UserRole.ADMIN,
        });
      }
      return client;
    } catch (e) {
      console.log(`Error creating client in cognito: ${e}`);
    }
  }
}
