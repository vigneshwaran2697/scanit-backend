import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityColumnsAdded1731762970633 implements MigrationInterface {
    name = 'UserEntityColumnsAdded1731762970633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "u_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "users" ADD "u_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "users" ADD "u_deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_created_at"`);
    }

}
