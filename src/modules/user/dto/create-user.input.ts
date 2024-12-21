import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSuperAdminInput {
  @Field()
  emailId: string;
  @Field()
  password: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
}
