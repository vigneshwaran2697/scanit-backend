import { Field, InputType } from '@nestjs/graphql';
import { ApprovalStatus } from '../entities/client.entity';

@InputType()
export class UpdateClientInput {
  @Field()
  clientId: string;

  @Field({ nullable: true })
  isApproved: ApprovalStatus;

  @Field()
  isActive: boolean;

  @Field({ nullable: true})
  rejectedReason: string;
}
