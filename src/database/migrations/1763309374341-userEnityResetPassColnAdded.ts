import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEnityResetPassColnAdded1763309374341 implements MigrationInterface {
    name = 'UserEnityResetPassColnAdded1763309374341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "u_reset_pwd_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_reset_pwd_token"`);
    }

}
