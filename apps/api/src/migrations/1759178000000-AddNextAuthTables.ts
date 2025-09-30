import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNextAuthTables1759178000000 implements MigrationInterface {
    name = 'AddNextAuthTables1759178000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Créer la table accounts
        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id" SERIAL NOT NULL,
                "compound_id" character varying(255) NOT NULL,
                "user_id" uuid NOT NULL,
                "provider_type" character varying(255) NOT NULL,
                "provider_id" character varying(255) NOT NULL,
                "provider_account_id" character varying(255) NOT NULL,
                "refresh_token" text,
                "access_token" text,
                "access_token_expires" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_accounts" PRIMARY KEY ("id")
            )
        `);

        // Créer la table sessions
        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" SERIAL NOT NULL,
                "user_id" uuid NOT NULL,
                "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
                "session_token" character varying(255) NOT NULL,
                "access_token" character varying(255) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_sessions" PRIMARY KEY ("id")
            )
        `);

        // Créer la table verification_requests
        await queryRunner.query(`
            CREATE TABLE "verification_requests" (
                "id" SERIAL NOT NULL,
                "identifier" character varying(255) NOT NULL,
                "token" character varying(255) NOT NULL,
                "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_verification_requests" PRIMARY KEY ("id")
            )
        `);

        // Ajouter les colonnes NextAuth à la table users
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "email_verified" TIMESTAMP WITH TIME ZONE,
            ADD COLUMN "image" text
        `);

        // Créer les index
        await queryRunner.query(`CREATE UNIQUE INDEX "compound_id" ON "accounts" ("compound_id")`);
        await queryRunner.query(`CREATE INDEX "provider_account_id" ON "accounts" ("provider_account_id")`);
        await queryRunner.query(`CREATE INDEX "provider_id" ON "accounts" ("provider_id")`);
        await queryRunner.query(`CREATE INDEX "user_id" ON "accounts" ("user_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "session_token" ON "sessions" ("session_token")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "access_token" ON "sessions" ("access_token")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "token" ON "verification_requests" ("token")`);

        // Ajouter les contraintes de clé étrangère
        await queryRunner.query(`
            ALTER TABLE "accounts" 
            ADD CONSTRAINT "FK_accounts_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "sessions" 
            ADD CONSTRAINT "FK_sessions_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer les contraintes de clé étrangère
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_sessions_user_id"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_accounts_user_id"`);

        // Supprimer les index
        await queryRunner.query(`DROP INDEX "token"`);
        await queryRunner.query(`DROP INDEX "access_token"`);
        await queryRunner.query(`DROP INDEX "session_token"`);
        await queryRunner.query(`DROP INDEX "user_id"`);
        await queryRunner.query(`DROP INDEX "provider_id"`);
        await queryRunner.query(`DROP INDEX "provider_account_id"`);
        await queryRunner.query(`DROP INDEX "compound_id"`);

        // Supprimer les colonnes NextAuth de la table users
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "email_verified",
            DROP COLUMN "image"
        `);

        // Supprimer les tables
        await queryRunner.query(`DROP TABLE "verification_requests"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }
}
