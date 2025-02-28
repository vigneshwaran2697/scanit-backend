import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ClientListResponse {
    @Field()
    clientId: string;

    @Field()
    clientName: string;

    @Field({ nullable: true })
    clientEmailId: string;

    @Field({ nullable: true })
    userLimit: number;

    @Field({ nullable: true })
    Address: string;

    @Field({ nullable: true })
    userCreated: number;

    @Field({ nullable: true })
    isActive: boolean;

    @Field({ nullable: true })
    updatedAt: Date

    @Field({ nullable: true })
    createdAt: Date
}