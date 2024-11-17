import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntityCreated1731840882946 implements MigrationInterface {
    name = 'ClientEntityCreated1731840882946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client" ("c_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "c_name" character varying NOT NULL, "c_user_limit" integer NOT NULL DEFAULT '0', "c_is_active" boolean DEFAULT true, "c_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "c_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "c_deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a5671dd1719545f778d891fd6aa" PRIMARY KEY ("c_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "u_is_active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "u_is_active" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "client"`);
    }
}
