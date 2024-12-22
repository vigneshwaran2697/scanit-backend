import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ClientContactInputs {
  @Field()
  emailId: string;

  @Field()
  phoneNumber: string;

  @Field()
  designation: string;

  @Field()
  name: string;

  @Field()
  order: number;

  @Field()
  isPrimary: boolean;
}

@InputType()
export class CreateClientInput {
  @Field()
  clientName: string;

  @Field(() => [ClientContactInputs])
  clientContactInputs: ClientContactInputs[];

  @Field()
  userLimit: number;

  @Field()
  isActive: boolean;

  @Field()
  Address: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  zipCode: number;

  @Field()
  gstDocument: string;

  @Field()
  gstNumber: string;
}
