import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from './author.entity';
import { AuthorResolver } from './author.resolver';
import { AuthorSeeder } from './author.seeder';
import { AuthorService } from './author.service';
import { AuthorDto } from './dto/author.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Author])],
      services: [AuthorService],
      resolvers: [
        {
          DTOClass: AuthorDto,
          EntityClass: Author,
          ServiceClass: AuthorService,
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
    TypeOrmModule.forFeature([Author]),
  ],
  providers: [AuthorResolver, AuthorSeeder],
  exports: [TypeOrmModule],
})
export class AuthorModule {}
