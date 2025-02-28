import { Field, InputType } from '@nestjs/graphql';
import { CreateClientSubscriptionInput } from './create-client-subscription.input';
import { PartialType } from '@nestjs/mapped-types';

@InputType()
export class UpdateClientSubscriptionInput extends PartialType(CreateClientSubscriptionInput) {
  @Field()
  id: string;
}
