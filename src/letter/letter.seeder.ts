import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';

import { Letter } from './letter.entity';

@Injectable()
export class LetterSeeder implements Seeder {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) { }

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/letters.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.letterRepository.metadata.tableName;
        await this.letterRepository.manager.query(
          `SELECT SETVAL('${tableName}_id_seq', ${element.id - 1})`,
        );
      }

      await this.letterRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.letterRepository.clear();
  }
}
