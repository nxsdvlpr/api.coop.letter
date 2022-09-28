import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { Letter } from './letter.entity';

@Injectable()
export class LetterSeeder implements Seeder {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) {}

  async seed(): Promise<any> {
    await this.letterRepository.save([]);
  }

  async drop(): Promise<any> {
    await this.letterRepository.clear();
  }
}
