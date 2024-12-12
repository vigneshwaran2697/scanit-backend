import { BaseRepository } from "src/database/base.respoitory";
import { Client } from "./entities/client.entity";
import { DataSource } from "typeorm";

export class ClientRepository extends BaseRepository<Client> {
    constructor(private readonly dataSource: DataSource) {
        super(Client, dataSource.createEntityManager());
    }

}