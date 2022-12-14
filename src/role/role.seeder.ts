import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { readFileSync } from 'fs';

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/roles.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.roleRepository.metadata.tableName;
        const seqNum = element.id - 1;
        if (seqNum > 0) {
          await this.roleRepository.manager.query(
            `SELECT SETVAL('${tableName}_id_seq', ${seqNum})`,
          );
        }
      }

      await this.roleRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.roleRepository.clear();
  }
}
