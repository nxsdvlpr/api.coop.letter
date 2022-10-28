import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { City } from './city.entity';

@Injectable()
export class CitySeeder implements Seeder {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/cities.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.cityRepository.metadata.tableName;
        const seqNum = element.id - 1;
        if (seqNum > 0) {
          await this.cityRepository.manager.query(
            `SELECT SETVAL('${tableName}_id_seq', ${seqNum})`,
          );
        }
      }

      await this.cityRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.cityRepository.clear();
  }
}
