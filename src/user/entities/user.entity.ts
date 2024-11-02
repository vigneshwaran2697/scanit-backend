import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    SUPER_ADMIN = 'SuperAdmin',
    TPV_ADMIN = 'TPV Admin',
    USER = 'User',
    LIVE_AGENT = 'Live Agent',
    VENDOR = 'Vendor',
  }

@ObjectType()
@Entity({ name: 'users' })
export class User {
    @Field()
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Field()
    @Column({ nullable: true, name: 'u_username' })
    username: string;
  
    @Field()
    @Column({ nullable: false, name: 'u_email_id' })
    emailId: string;
  
    @Field({ nullable: true })
    @Column({ length: 255, name: 'u_first_name', nullable: true })
    firstName: string;
  
    @Field({ nullable: true })
    @Column({ length: 255, name: 'u_last_name', nullable: true })
    lastName: string;
  
    @Field({ nullable: true })
    @Column({ nullable: true, name: 'u_phone_number' })
    phoneNumber?: string;
}