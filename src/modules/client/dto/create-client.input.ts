import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateClientInput {
  @Field()
  clientName: string;

  @Field()
  clientEmailId: string;

  @Field()
  clientFirstName: string;

  @Field()
  clientLastName: string;

  @Field()
  clientPhoneNumber: string;

  @Field()
  userLimit: number;

  @Field()
  isActive: boolean;
}
