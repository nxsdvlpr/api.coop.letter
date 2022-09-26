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

    await this.roleRepository.save(data);
  }

  async drop(): Promise<any> {
    await this.roleRepository.clear();
  }
}
