import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { Company } from './company.entity';

@Injectable()
export class CompanySeeder implements Seeder {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/companies.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.companyRepository.metadata.tableName;
        const seqNum = element.id - 1;
        if (seqNum > 0) {
          await this.companyRepository.manager.query(
            `SELECT SETVAL('${tableName}_id_seq', ${seqNum})`,
          );
        }
      }

      await this.companyRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.companyRepository.clear();
  }
}
