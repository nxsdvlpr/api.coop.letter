import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLetterTable1645160828157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'letter',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'user_id',
            type: 'integer',
          },
          {
            name: 'author_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'city_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'ref',
            type: 'varchar',
            isUnique: true,
            length: '30',
          },
          {
            name: 'published_date',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'company_id',
            type: 'integer',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '1',
          },
          {
            name: 'to',
            type: 'varchar',
          },
          {
            name: 'subject',
            type: 'varchar',
          },
          {
            name: 'attachment',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('letter', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedTableName: 'author',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('letter');

    // User
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter', userForeignKey);
    await queryRunner.dropColumn('letter', 'user_id');

    // Author
    const authorForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('author_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter', authorForeignKey);
    await queryRunner.dropColumn('letter', 'author_id');

    // City
    const cityForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('city_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter', cityForeignKey);
    await queryRunner.dropColumn('letter', 'city_id');

    // Company
    const companyForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('company_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter', companyForeignKey);
    await queryRunner.dropColumn('letter', 'company_id');

    await queryRunner.dropTable('letter');
  }
}
