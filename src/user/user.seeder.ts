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

    const users = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      element.password = bcrypt.hashSync(element.password, 10);
      users.push(element);
    }

    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    await this.userRepository.clear();
  }
}
