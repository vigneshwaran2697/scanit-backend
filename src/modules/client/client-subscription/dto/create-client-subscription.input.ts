import { Field, InputType } from "@nestjs/graphql";
import { PlanDurationType } from "../entities/client-subscription.entity";

@InputType()
export class CreateClientSubscriptionInput {
  @Field({ nullable: true})
  planName: string;

  @Field({ nullable: true})
  planPrice: number;

  @Field({ nullable: true})
  planDuration: number;

  @Field(() => PlanDurationType, { nullable: true })
  planDurationType: PlanDurationType;
}
