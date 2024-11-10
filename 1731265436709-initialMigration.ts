import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731265436709 implements MigrationInterface {
    name = 'InitialMigration1731265436709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_61f1b83047e0c722f4bfdd34c17"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "rentId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "rentId" uuid`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_5416388f0aa811450ccf5a010c5"`);
        await queryRunner.query(`ALTER TABLE "renter" DROP CONSTRAINT "FK_c54921124f3f91aad2b0bb95d46"`);
        await queryRunner.query(`ALTER TABLE "renter" DROP CONSTRAINT "PK_7d1963dd773c2a2a44fc93a956f"`);
        await queryRunner.query(`ALTER TABLE "renter" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "renter" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "renter" ADD CONSTRAINT "PK_7d1963dd773c2a2a44fc93a956f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "renter" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "renter" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_44b289161596a6221fd5e7cf104"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_49296d11229074f058b7274ae2e"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "PK_211f726fd8264e82ff7a2b86ce2"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "PK_211f726fd8264e82ff7a2b86ce2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "renterId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "renterId" uuid`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "locationId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "locationId" uuid`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_61f1b83047e0c722f4bfdd34c17" FOREIGN KEY ("rentId") REFERENCES "rent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "renter" ADD CONSTRAINT "FK_c54921124f3f91aad2b0bb95d46" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_5416388f0aa811450ccf5a010c5" FOREIGN KEY ("renterId") REFERENCES "renter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_44b289161596a6221fd5e7cf104" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_49296d11229074f058b7274ae2e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_49296d11229074f058b7274ae2e"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_44b289161596a6221fd5e7cf104"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "FK_5416388f0aa811450ccf5a010c5"`);
        await queryRunner.query(`ALTER TABLE "renter" DROP CONSTRAINT "FK_c54921124f3f91aad2b0bb95d46"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_61f1b83047e0c722f4bfdd34c17"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_5e718539594d02a4c75ddc1ca56" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "locationId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "locationId" integer`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "renterId"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "renterId" integer`);
        await queryRunner.query(`ALTER TABLE "rent" DROP CONSTRAINT "PK_211f726fd8264e82ff7a2b86ce2"`);
        await queryRunner.query(`ALTER TABLE "rent" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "rent" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "PK_211f726fd8264e82ff7a2b86ce2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_49296d11229074f058b7274ae2e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_44b289161596a6221fd5e7cf104" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "renter" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "renter" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "renter" DROP CONSTRAINT "PK_7d1963dd773c2a2a44fc93a956f"`);
        await queryRunner.query(`ALTER TABLE "renter" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "renter" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "renter" ADD CONSTRAINT "PK_7d1963dd773c2a2a44fc93a956f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "renter" ADD CONSTRAINT "FK_c54921124f3f91aad2b0bb95d46" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent" ADD CONSTRAINT "FK_5416388f0aa811450ccf5a010c5" FOREIGN KEY ("renterId") REFERENCES "renter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "rentId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "rentId" integer`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_61f1b83047e0c722f4bfdd34c17" FOREIGN KEY ("rentId") REFERENCES "rent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
