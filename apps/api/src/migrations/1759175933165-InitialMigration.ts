import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759175933165 implements MigrationInterface {
    name = 'InitialMigration1759175933165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('income', 'expense', 'transfer')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_category_enum" AS ENUM('salary', 'freelance', 'investment', 'bonus', 'other_income', 'food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'other_expense')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "category" "public"."transactions_category_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "description" character varying NOT NULL, "date" date NOT NULL, "notes" character varying, "tags" character varying, "isRecurring" boolean NOT NULL DEFAULT false, "recurringPattern" character varying, "recurringEndDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca1731da21fb4ef896fcd4356b" ON "transactions" ("userId", "category") `);
        await queryRunner.query(`CREATE INDEX "IDX_3dae3ed25e0d76f419fcb89ead" ON "transactions" ("userId", "type") `);
        await queryRunner.query(`CREATE INDEX "IDX_31c0fafe7c59f688d0e7e7e322" ON "transactions" ("userId", "date") `);
        await queryRunner.query(`CREATE TYPE "public"."goals_type_enum" AS ENUM('savings', 'debt_payoff', 'emergency_fund', 'vacation', 'purchase', 'investment', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."goals_status_enum" AS ENUM('active', 'completed', 'paused', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying, "type" "public"."goals_type_enum" NOT NULL, "status" "public"."goals_status_enum" NOT NULL DEFAULT 'active', "targetAmount" numeric(10,2) NOT NULL, "currentAmount" numeric(10,2) NOT NULL DEFAULT '0', "targetDate" date NOT NULL, "monthlyContribution" numeric(10,2), "color" character varying, "icon" character varying, "isRecurring" boolean NOT NULL DEFAULT false, "recurringPattern" character varying, "recurringEndDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d74991c2fba0c18a1b93668e75" ON "goals" ("userId", "type") `);
        await queryRunner.query(`CREATE INDEX "IDX_618b41eda280b30fe5e8611b8d" ON "goals" ("userId", "status") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying, "avatar" character varying, "currency" character varying NOT NULL DEFAULT 'USD', "language" character varying NOT NULL DEFAULT 'en', "theme" character varying NOT NULL DEFAULT 'light', "totalIncome" numeric(10,2) NOT NULL DEFAULT '0', "totalExpenses" numeric(10,2) NOT NULL DEFAULT '0', "totalSavings" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "FK_57dd8a3fc26eb760d076bf8840e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "FK_57dd8a3fc26eb760d076bf8840e"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_618b41eda280b30fe5e8611b8d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d74991c2fba0c18a1b93668e75"`);
        await queryRunner.query(`DROP TABLE "goals"`);
        await queryRunner.query(`DROP TYPE "public"."goals_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."goals_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31c0fafe7c59f688d0e7e7e322"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3dae3ed25e0d76f419fcb89ead"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca1731da21fb4ef896fcd4356b"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
