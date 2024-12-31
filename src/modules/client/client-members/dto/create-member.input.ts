import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMemberInput {
    @Field()
    fullName: string;

    @Field()
    sonOf: string;

    @Field()
    dob: string;

    @Field()
    employeeId: string;

    @Field()
    presentAddress: string;

    @Field()
    permanentAddress: string;

    @Field()
    designation: string;

    @Field()
    dateOfJoining: string;

    @Field()
    photograph: string;

    @Field()
    aadhaarCard: string;

    @Field()
    phoneNumber: string;

    @Field()
    emailId: string;

    @Field()
    gender: string;

    @Field()
    idIssueDate: string;

    @Field()
    expiryDate: string;
}
