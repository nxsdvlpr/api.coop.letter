import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { LetterTag } from './letter-tag.entity';
import { Tag } from './tag.entity';

@Injectable()
export class TagSeeder implements Seeder {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(LetterTag)
    private readonly customerTagRepository: Repository<LetterTag>,
  ) { }

  async seed(): Promise<any> {
    const tags = DataFactory.createForClass(Tag).generate(5);
    await this.tagRepository.save(tags);

    const customerTags = DataFactory.createForClass(LetterTag).generate(20);
    await this.customerTagRepository.save(customerTags);
  }

  async drop(): Promise<any> {
    await this.customerTagRepository.clear();
    await this.tagRepository.clear();
  }
}
