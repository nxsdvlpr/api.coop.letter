import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './tag.entity';
import { TagDto } from './dto/tag.dto';
import { TagSeeder } from './tag.seeder';
import { LetterTag } from './letter-tag.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Tag])],
      resolvers: [
        {
          DTOClass: TagDto,
          EntityClass: Tag,
          enableAggregate: true,
        },
      ],
    }),
    TypeOrmModule.forFeature([Tag, LetterTag]),
  ],
  providers: [TagSeeder],
  exports: [TypeOrmModule],
})
export class TagModule { }
