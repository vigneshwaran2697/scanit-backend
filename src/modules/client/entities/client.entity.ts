import { Field } from '@nestjs/graphql';
import { AppConstants } from 'src/utils/app-constants';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'client' })
export class Client {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'c_id' })
  clientId: string;

  @Field({ nullable: true })
  @Column({ name: 'c_name' })
  clientName: string;

  @Field({ nullable: true })
  @Column({ name: 'c_user_limit', type: 'int', default: 0 })
  userLimit: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'c_is_active', default: true })
  isActive?: boolean;

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
