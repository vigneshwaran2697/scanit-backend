import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { AppConstants } from 'src/utils/app-constants';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Members } from '../client-members/entity/client-members.entity';

export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

registerEnumType(ApprovalStatus, { name: 'ApprovalStatus' });

@Entity({ name: 'client' })
@ObjectType()
export class Client {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'c_id' })
  clientId: string;

  @Field({ nullable: true })
  @Column({ name: 'c_name' })
  clientName: string;

  @Field({ nullable: true })
  @Column({ name: 'c_email_id' })
  clientEmailId: string;

  @Field({ nullable: true })
  @Column({ name: 'c_user_limit', type: 'int', default: 0 })
  userLimit: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'c_is_active', default: true })
  isActive?: boolean;

  @Field(() => ApprovalStatus, { nullable: true })
  @Column({ nullable: true, name: 'c_is_approved', type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  isApproved?: ApprovalStatus;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.client)
  users: User[];

  @Field(() => [Members])
  @OneToMany(() => Members, (members) => members.client)
  members: Members[];

  @Field()
  @Column({ name: 'c_address' })
  Address: string;

  @Field()
  @Column({ name: 'c_city' })
  city: string;

  @Field()
  @Column({ name: 'c_state' })
  state: string;

  @Field()
  @Column({ name: 'c_country' })
  country: string;

  @Field()
  @Column({ name: 'c_zipcode', nullable: true })
  zipCode: number;

  @Field()
  @Column({ name: 'c_gst_document' })
  gstDocument: string;

  @Field()
  @Column({ name: 'c_gst_number' })
  gstNumber: string;

  @Field({ nullable: false })
  @CreateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    name: 'c_created_at',
  })
  public createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    onUpdate: AppConstants.CURRENT_TIMESTAMP,
    name: 'c_updated_at',
  })
  public updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({
    name: 'c_deleted_at',
    type: AppConstants.TIME_WITH_ZONE_TYPE,
  })
  public deletedAt?: Date;
}
