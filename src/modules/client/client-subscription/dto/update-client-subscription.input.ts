import { Field, InputType } from '@nestjs/graphql';
import { CreateClientSubscriptionInput } from './create-client-subscription.input';
import { PartialType } from '@nestjs/mapped-types';
import { PlanDurationType } from '../entities/client-subscription.entity';

@InputType()
export class UpdateClientSubscriptionInput {
  @Field()
  id: string;

  @Field({ nullable: true})
  planName: string;

  @Field({ nullable: true})
  planPrice: number;

  @Field({ nullable: true})
  planDuration: number;

  @Field(() => PlanDurationType, { nullable: true })
  planDurationType: PlanDurationType;
}
