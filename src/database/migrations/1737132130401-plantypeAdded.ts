import { MigrationInterface, QueryRunner } from "typeorm";

export class PlantypeAdded1737132130401 implements MigrationInterface {
    name = 'PlantypeAdded1737132130401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "c_plan_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_plan_type"`);
    }

}
