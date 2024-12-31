import { Field, ObjectType } from '@nestjs/graphql';
import { AppConstants } from 'src/utils/app-constants';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../entities/client.entity';

@ObjectType()
@Entity({ name: 'members' })
export class Members {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  id: string;

  @Field()
  @Column({ name: 'm_full_name' })
  fullName: string;

  @Field()
  @Column({ name: 'm_phone_number' })
  phoneNumber: string;

  @Field()
  @Column({ name: 'm_email_id' })
  emailId: string;

  @Field()
  @Column({ name: 'm_is_active' })
  isActive: boolean;

  @Field()
  @Column({ name: 'm_son_of' })
  sonOf: string;

  @Field()
  @Column({ name: 'm_dob' })
  dob: string;

  @Field()
  @Column({ name: 'm_employee_id' })
  employeeId: string;

  @Field({ nullable: true })
  @Column({ name: 'client_id', nullable: true })
  clientId?: string;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.members)
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @Field()
  @Column({ name: 'm_present_address' })
  presentAddress: string;

  @Field()
  @Column({ name: 'm_permanent_address' })
  permanentAddress: string;

  @Field()
  @Column({ name: 'm_designation' })
  designation: string;

  @Field()
  @Column({ name: 'm_date_of_joining' })
  dateOfJoining: string;

  @Field()
  @Column({ name: 'm_photograph' })
  photograph: string;

  @Field()
  @Column({ name: 'm_aadhaar_card' })
  aadhaarCard: string;

  @Field()
  @Column({ name: 'm_gender' })
  gender: string;

  @Field()
  @Column({ name: 'm_id_issue_date' })
  idIssueDate: string;

  @Field()
  @Column({ name: 'm_expiry_date ' })
  expiryDate: string;

  @Field({ nullable: false })
  @CreateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    name: 'm_created_at',
  })
  public createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    onUpdate: AppConstants.CURRENT_TIMESTAMP,
    name: 'm_updated_at',
  })
  public updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({
    name: 'm_deleted_at',
    type: AppConstants.TIME_WITH_ZONE_TYPE,
  })
  public deletedAt?: Date;
}
