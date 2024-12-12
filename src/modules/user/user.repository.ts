import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/database/base.respoitory";
import { User } from "./entities/user.entity";
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async findByEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
      .select('user')
      .where('user.emailId = :email', { email })
      .getOneOrFail();
  }
}