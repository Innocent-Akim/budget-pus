import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1759177621231 implements MigrationInterface {
    name = 'AddPasswordToUser1759177621231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
