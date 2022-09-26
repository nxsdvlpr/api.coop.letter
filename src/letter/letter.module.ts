import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonService } from 'src/common/common.service';

import { Letter } from './letter.entity';
import { LetterResolver } from './letter.resolver';
import { LetterSeeder } from './letter.seeder';
import { LetterService } from './letter.service';
import { LetterDto } from './dto/letter.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Letter])],
      services: [LetterService, CommonService],
      resolvers: [
        {
          DTOClass: LetterDto,
          EntityClass: Letter,
          ServiceClass: LetterService,
          enableAggregate: true,
          create: {
            disabled: true,
          },
          update: {
            disabled: true,
          },
        },
      ],
    }),
    TypeOrmModule.forFeature([Letter]),
  ],
  providers: [LetterResolver, LetterSeeder],
  exports: [TypeOrmModule],
})
export class LetterModule { }
