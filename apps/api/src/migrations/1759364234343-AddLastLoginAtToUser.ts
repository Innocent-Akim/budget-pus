import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginAtToUser1759364234343 implements MigrationInterface {
    name = 'AddLastLoginAtToUser1759364234343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_at"`);
    }

}
