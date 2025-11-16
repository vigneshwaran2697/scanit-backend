import { Field, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/modules/client/entities/client.entity';
import { AppConstants } from 'src/utils/app-constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  USER = 'User',
}

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({ nullable: true, name: 'u_username' })
  username: string;

  @Field()
  @Column({ nullable: false, name: 'u_email_id' })
  emailId: string;

  @Field({ nullable: true })
  @Column({ length: 255, name: 'u_first_name', nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ length: 255, name: 'u_last_name', nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_phone_number' })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Column({ name: 'client_id', nullable: true })
  clientId?: string;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.users)
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_designation' })
  designation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_order' })
  order?: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_user_role' })
  userRole?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_is_active', default: true })
  isActive?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_is_primary', default: true })
  isPrimary?: boolean;

  @Field({ nullable: false })
  @CreateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    name: 'u_created_at',
  })
  public createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    onUpdate: AppConstants.CURRENT_TIMESTAMP,
    name: 'u_updated_at',
  })
  public updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({
    name: 'u_deleted_at',
    type: AppConstants.TIME_WITH_ZONE_TYPE,
  })
  public deletedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'u_reset_pwd_token' })
  resetPwdToken?: string;
}
