import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateClientInput {
  @Field()
  clientId: string;

  @Field({ nullable: true })
  isApproved: boolean;

  @Field()
  isActive: boolean;
}
