import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLetterTable1645160828154 implements MigrationInterface {
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
            name: 'ref',
            type: 'varchar',
            isUnique: true,
            default: `random_string(6)`,
            length: '6',
          },
          {
            name: 'published_date',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'destination',
            type: 'varchar',
          },
          {
            name: 'subject',
            type: 'varchar',
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
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('letter');

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter', foreignKey);
    await queryRunner.dropColumn('letter', 'user_id');

    await queryRunner.dropTable('letter');
  }
}
