import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntityChanges1734892505421 implements MigrationInterface {
    name = 'ClientEntityChanges1734892505421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "u_designation" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "u_order" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "u_is_primary" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_zipcode" integer`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_gst_document" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "c_gst_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0d1e90d75674c54f8660c4ed446" FOREIGN KEY ("client_id") REFERENCES "client"("c_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0d1e90d75674c54f8660c4ed446"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_gst_number"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_gst_document"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_zipcode"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_country"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_state"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_city"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "c_address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_is_primary"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_order"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "u_designation"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "client_id"`);
    }

}
