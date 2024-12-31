import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateMemberInput } from "./create-member.input";

@InputType()
export class UpdateMemberInput extends PartialType(CreateMemberInput) {
    @Field()
    id: string;

    @Field({ nullable: true })  
    isActive: boolean;
}