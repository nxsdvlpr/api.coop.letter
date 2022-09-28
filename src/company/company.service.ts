import { assign } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateCompanyInput } from './dto/create-company.input';
import { Company } from './company.entity';
import { UpdateCompanyInput } from './dto/update-company.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { QuickOrm } from 'src/utils';

@QueryService(Company)
export class CompanyService extends TypeOrmQueryService<Company> {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateCompanyInput,
  ): Promise<Company> {
    const data = assign(new Company(), input);

    const company = new QuickOrm(this.companyRepository);

    return company.create(data);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateCompanyInput,
  ): Promise<Company> {
    const data = {
      id: input.id,
      update: assign(new Company(), input.update),
    };

    const company = new QuickOrm(this.companyRepository);

    return company.update(data);
  }

  async setCounter(id: string, value: number) {
    return this.companyRepository.update(
      { id },
      {
        counter: value,
      },
    );
  }
}
