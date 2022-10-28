import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { Author } from './author.entity';

@Injectable()
export class AuthorSeeder implements Seeder {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/authors.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.authorRepository.metadata.tableName;
        const seqNum = element.id - 1;
        if (seqNum > 0) {
          await this.authorRepository.manager.query(
            `SELECT SETVAL('${tableName}_id_seq', ${seqNum})`,
          );
        }
      }

      await this.authorRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.authorRepository.clear();
  }
}
