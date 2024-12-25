import { BaseRepository } from "src/database/base.respoitory";
import { Client } from "./entities/client.entity";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateClientInput } from "./dto/create-client.input";
import { UserRepository } from "../user/user.repository";
import { Transactional } from 'typeorm-transactional';
import { UserRole } from "../user/entities/user.entity";

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userRepo: UserRepository){
        super(Client, dataSource.createEntityManager());
    }

    @Transactional()
    public async createClient(createClientInput: CreateClientInput): Promise<Client> {
        const client = await this.save({
            clientName: createClientInput.clientName,
            userLimit: createClientInput.userLimit,
            isActive: createClientInput.isActive,
            Address: createClientInput.Address,
            city: createClientInput.city,
            zipCode: createClientInput.zipCode,
            gstDocument: createClientInput.gstDocument,
            gstNumber: createClientInput.gstNumber,
            state: createClientInput.state,
            country: createClientInput.country,
        })

        console.log(client);
        for (const clientUser of createClientInput.clientContactInputs){
            if (clientUser.isPrimary){
                //Todo create a client primary user
            }
            const user = await this.userRepo.save({
                emailId: clientUser.emailId,
                phoneNumber: clientUser.phoneNumber,
                designation: clientUser.designation,
                firstName: clientUser.name,
                order: clientUser.order,
                isPrimary: clientUser.isPrimary,
                clientId: client.clientId,
                userRole: UserRole.ADMIN
            })
            console.log(user);
            
        }
        return client;
    }
}