import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLetterTagTable1645160828157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'letter_tag',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'letter_id',
            type: 'int',
          },
          {
            name: 'tag_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('letter_tag', [
      new TableForeignKey({
        columnNames: ['letter_id'],
        referencedTableName: 'letter',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedTableName: 'tag',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('letter_tag');
    const letterIdForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('letter_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter_tag', letterIdForeignKey);
    await queryRunner.dropColumn('letter_tag', 'letter_id');

    const tagIdForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tag_id') !== -1,
    );
    await queryRunner.dropForeignKey('letter_tag', tagIdForeignKey);
    await queryRunner.dropColumn('letter_tag', 'tag_id');
    await queryRunner.dropTable('letter_tag');
  }
}
