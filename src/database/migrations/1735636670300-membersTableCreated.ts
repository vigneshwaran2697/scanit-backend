import { MigrationInterface, QueryRunner } from "typeorm";

export class MembersTableCreated1735636670300 implements MigrationInterface {
    name = 'MembersTableCreated1735636670300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members" ("member_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "m_full_name" character varying NOT NULL, "m_phone_number" character varying NOT NULL, "m_email_id" character varying NOT NULL, "m_is_active" boolean NOT NULL, "m_son_of" character varying NOT NULL, "m_dob" character varying NOT NULL, "m_employee_id" character varying NOT NULL, "client_id" uuid, "m_present_address" character varying NOT NULL, "m_permanent_address" character varying NOT NULL, "m_designation" character varying NOT NULL, "m_date_of_joining" character varying NOT NULL, "m_photograph" character varying NOT NULL, "m_aadhaar_card" character varying NOT NULL, "m_gender" character varying NOT NULL, "m_id_issue_date" character varying NOT NULL, "m_expiry_date " character varying NOT NULL, "m_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "m_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "m_deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7613f2f182039ec974f24a53810" PRIMARY KEY ("member_id"))`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_0a57da3187cf1abfed95a164b21" FOREIGN KEY ("client_id") REFERENCES "client"("c_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_0a57da3187cf1abfed95a164b21"`);
        await queryRunner.query(`DROP TABLE "members"`);
    }

}
