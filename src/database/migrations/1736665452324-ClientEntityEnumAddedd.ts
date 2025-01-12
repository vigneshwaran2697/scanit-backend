import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntityEnumAddedd1736665452324 implements MigrationInterface {
    name = 'ClientEntityEnumAddedd1736665452324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_is_approved"`);
        await queryRunner.query(`CREATE TYPE "public"."client_c_is_approved_enum" AS ENUM('APPROVED', 'PENDING', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_is_approved" "public"."client_c_is_approved_enum" DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_is_approved"`);
        await queryRunner.query(`DROP TYPE "public"."client_c_is_approved_enum"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_is_approved" boolean DEFAULT false`);
    }

}
