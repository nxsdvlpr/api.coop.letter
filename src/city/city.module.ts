import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './city.entity';
import { CityResolver } from './city.resolver';
import { CitySeeder } from './city.seeder';
import { CityService } from './city.service';
import { CityDto } from './dto/city.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([City])],
      services: [CityService],
      resolvers: [
        {
          DTOClass: CityDto,
          EntityClass: City,
          ServiceClass: CityService,
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
    TypeOrmModule.forFeature([City]),
  ],
  providers: [CityResolver, CitySeeder],
  exports: [TypeOrmModule],
})
export class CityModule {}
