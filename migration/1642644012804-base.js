const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class base1642644012804 {
    name = 'base1642644012804'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`status\` varchar(1) NOT NULL DEFAULT 'A',
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users_establishments\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`role\` int(1) NOT NULL,
                \`userId\` int NULL,
                \`establishmentId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`establishments\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`corporateName\` varchar(255) NOT NULL,
                \`tradeName\` varchar(255) NOT NULL,
                \`registry\` varchar(255) NOT NULL,
                \`status\` varchar(1) NOT NULL DEFAULT 'A',
                UNIQUE INDEX \`IDX_c30ce5db18d6551000a9e2d214\` (\`registry\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`entrances\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`title\` varchar(255) NOT NULL,
                \`active\` tinyint NOT NULL,
                \`establishmentId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_establishments\`
            ADD CONSTRAINT \`FK_5759920b2718a54207e7f729387\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_establishments\`
            ADD CONSTRAINT \`FK_1c2445174e6826c2a906a101dc7\` FOREIGN KEY (\`establishmentId\`) REFERENCES \`establishments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`entrances\`
            ADD CONSTRAINT \`FK_04f199f56c1bee806b6f202ae92\` FOREIGN KEY (\`establishmentId\`) REFERENCES \`establishments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`entrances\` DROP FOREIGN KEY \`FK_04f199f56c1bee806b6f202ae92\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_establishments\` DROP FOREIGN KEY \`FK_1c2445174e6826c2a906a101dc7\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users_establishments\` DROP FOREIGN KEY \`FK_5759920b2718a54207e7f729387\`
        `);
        await queryRunner.query(`
            DROP TABLE \`entrances\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_c30ce5db18d6551000a9e2d214\` ON \`establishments\`
        `);
        await queryRunner.query(`
            DROP TABLE \`establishments\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users_establishments\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }
}
