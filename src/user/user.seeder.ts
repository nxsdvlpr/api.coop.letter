import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'fs';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<any> {
    const jsonFile = readFileSync('./seeders/users.json', 'utf8');
    const data = JSON.parse(jsonFile);

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.id) {
        const tableName = this.userRepository.metadata.tableName;
        const seqNum = element.id - 1;

        if (seqNum > 0) {
          await this.userRepository.manager.query(
            `SELECT SETVAL('${tableName}_id_seq', ${seqNum})`,
          );
        }
      }

      element.password = bcrypt.hashSync(element.password, 10);

      await this.userRepository.save(element);
    }
  }

  async drop(): Promise<any> {
    await this.userRepository.clear();
  }
}
