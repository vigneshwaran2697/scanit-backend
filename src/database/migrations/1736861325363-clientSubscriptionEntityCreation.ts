import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientSubscriptionEntityCreation1736861325363 implements MigrationInterface {
    name = 'ClientSubscriptionEntityCreation1736861325363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_subscription_cs_plan_duration_type_enum" AS ENUM('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY')`);
        await queryRunner.query(`CREATE TABLE "client_subscription" ("cs_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cs_plan_name" character varying NOT NULL, "cs_plan_price" integer NOT NULL, "cs_plan_duration" integer NOT NULL, "cs_plan_duration_type" "public"."client_subscription_cs_plan_duration_type_enum", "cs_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cs_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cs_deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0b4e08b6ac20cc28b7c187049d1" PRIMARY KEY ("cs_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "client_subscription"`);
        await queryRunner.query(`DROP TYPE "public"."client_subscription_cs_plan_duration_type_enum"`);
    }

}
