import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntityChanges1741511323624 implements MigrationInterface {
    name = 'ClientEntityChanges1741511323624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "c_rejected_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_rejected_reason"`);
    }

}
