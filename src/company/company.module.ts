import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './company.entity';
import { CompanyResolver } from './company.resolver';
import { CompanySeeder } from './company.seeder';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { CompanySchedule } from './company.schedule';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Company])],
      services: [CompanyService],
      resolvers: [
        {
          DTOClass: CompanyDto,
          EntityClass: Company,
          ServiceClass: CompanyService,
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
    TypeOrmModule.forFeature([Company]),
  ],
  providers: [CompanyResolver, CompanySchedule, CompanySeeder],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
