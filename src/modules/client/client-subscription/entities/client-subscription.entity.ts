import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AppConstants } from 'src/utils/app-constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanDurationType {
    ONE_TIME = 'ONE_TIME',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    HALF_YEARLY = 'HALF_YEARLY',
    YEARLY = 'YEARLY',
}
registerEnumType(PlanDurationType, { name: 'PlanDurationType' });

@ObjectType()
@Entity({ name: 'client_subscription' })
export class ClientSubscription {
  @Field({ nullable: true})
  @PrimaryGeneratedColumn('uuid', { name: 'cs_id' })
  id: string;

  @Field({ nullable: true})
  @Column({ name: 'cs_plan_name' })
  planName: string;

  @Field({ nullable: true})
  @Column({ name: 'cs_plan_price' })
  planPrice: number;

  @Field({ nullable: true})
  @Column({ name: 'cs_plan_duration' })
  planDuration: number;

  @Field(() => PlanDurationType, { nullable: true })
  @Column({ name: 'cs_plan_duration_type' , nullable: true, type: 'enum', enum: PlanDurationType })
  planDurationType: PlanDurationType;

  @Field({ nullable: true })
  @CreateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    name: 'cs_created_at',
  })
  public createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({
    type: AppConstants.TIME_WITH_ZONE_TYPE,
    default: () => AppConstants.CURRENT_TIMESTAMP,
    onUpdate: AppConstants.CURRENT_TIMESTAMP,
    name: 'cs_updated_at',
  })
  public updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({
    name: 'cs_deleted_at',
    type: AppConstants.TIME_WITH_ZONE_TYPE,
  })
  public deletedAt?: Date;
}
