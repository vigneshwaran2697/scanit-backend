import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientApprovalColumnAdded1735064654151 implements MigrationInterface {
    name = 'ClientApprovalColumnAdded1735064654151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "c_is_approved" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_is_approved"`);
    }

}
