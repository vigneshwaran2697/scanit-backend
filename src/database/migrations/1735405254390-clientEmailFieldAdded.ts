import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEmailFieldAdded1735405254390 implements MigrationInterface {
    name = 'ClientEmailFieldAdded1735405254390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "c_email_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_email_id"`);
    }

}
