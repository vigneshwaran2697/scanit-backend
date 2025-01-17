import { Injectable } from "@nestjs/common";
import { ClientSubscription } from "./entities/client-subscription.entity";
import { DataSource } from "typeorm";
import { BaseRepository } from "src/database/base.respoitory";

@Injectable()
export class ClientSubscriptionRepository extends BaseRepository<ClientSubscription> {
  constructor(private readonly dataSource: DataSource) {
    super(ClientSubscription, dataSource.createEntityManager());
  }

}