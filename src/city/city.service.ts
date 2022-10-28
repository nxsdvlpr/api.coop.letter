import { assign } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateCityInput } from './dto/create-city.input';
import { City } from './city.entity';
import { UpdateCityInput } from './dto/update-city.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { QuickOrm } from 'src/utils';

@QueryService(City)
export class CityService extends TypeOrmQueryService<City> {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {
    super(cityRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateCityInput,
  ): Promise<City> {
    const data = assign(new City(), input);

    const city = new QuickOrm(this.cityRepository);

    return city.create(data);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateCityInput,
  ): Promise<City> {
    const data = {
      id: input.id,
      update: assign(new City(), input.update),
    };

    const city = new QuickOrm(this.cityRepository);

    return city.update(data);
  }
}
