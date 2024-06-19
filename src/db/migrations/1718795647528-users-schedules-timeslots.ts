import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersSchedulesTimeslots1718795647528 implements MigrationInterface {
    name = 'UsersSchedulesTimeslots1718795647528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('MERCHANT', 'CUSTOMER', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'approved', 'rejected', 'inactive', 'active')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL DEFAULT 'PLACEHOLDER_PASSWORD', "ip" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER', "fcmToken" character varying(255), "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "schedule_definition" ("id" SERIAL NOT NULL, "merchantId" uuid, "timeSlots" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6a665bf03f8bb1811b9451b14e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65757aed9a5baaba90562cf1dc" ON "schedule_definition" ("merchantId") `);
        await queryRunner.query(`CREATE TABLE "time_slot" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "scheduleId" integer, CONSTRAINT "PK_03f782f8c4af029253f6ad5bacf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "merchantId" uuid, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "scheduleDefinitionId" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab7db41b1c7cd0ab8701c0f710" ON "schedule" ("merchantId") `);
        await queryRunner.query(`ALTER TABLE "schedule_definition" ADD CONSTRAINT "FK_65757aed9a5baaba90562cf1dc4" FOREIGN KEY ("merchantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_slot" ADD CONSTRAINT "FK_9135813efe161757c3fe2c2db9b" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_ab7db41b1c7cd0ab8701c0f7102" FOREIGN KEY ("merchantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_a10ed965884ef2fbae829815deb" FOREIGN KEY ("scheduleDefinitionId") REFERENCES "schedule_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_a10ed965884ef2fbae829815deb"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_ab7db41b1c7cd0ab8701c0f7102"`);
        await queryRunner.query(`ALTER TABLE "time_slot" DROP CONSTRAINT "FK_9135813efe161757c3fe2c2db9b"`);
        await queryRunner.query(`ALTER TABLE "schedule_definition" DROP CONSTRAINT "FK_65757aed9a5baaba90562cf1dc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab7db41b1c7cd0ab8701c0f710"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TABLE "time_slot"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65757aed9a5baaba90562cf1dc"`);
        await queryRunner.query(`DROP TABLE "schedule_definition"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
