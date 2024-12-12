import { MigrationInterface, QueryRunner } from "typeorm";

export class AllEntities1731472886257 implements MigrationInterface {
    name = 'AllEntities1731472886257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "u_username" character varying, "u_email_id" character varying NOT NULL, "u_first_name" character varying(255), "u_last_name" character varying(255), "u_phone_number" character varying, "u_user_role" character varying, "u_is_active" boolean, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
