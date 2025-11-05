import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientPropertyFieldsAdded1762315116448 implements MigrationInterface {
    name = 'ClientPropertyFieldsAdded1762315116448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "c_logo_url" character varying`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_color_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_color_code"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_logo_url"`);
    }

}
