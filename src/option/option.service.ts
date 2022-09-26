import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { Option } from './option.entity';
import { UpdateOptionInput } from './dto/update-option.input';
import { BadRequestException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';

@QueryService(Option)
export class OptionService extends TypeOrmQueryService<Option> {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {
    super(optionRepository);
  }

  async updateOptions(
    authUser: AuthenticatedUser,
    input: UpdateOptionInput,
  ): Promise<any> {
    if (authUser.role.shortname !== 'admin') {
      throw new BadRequestException(
        'You are not allowed to perform this action',
      );
    }

    for (let index = 0; index < input.options.length; index++) {
      const el = input.options[index];
      const strValue = this.stringify(el);

      await this.optionRepository.update(
        { name: el.name },
        { value: strValue },
      );
    }

    return input;
  }

  async list(): Promise<Option[]> {
    return this.optionRepository
      .createQueryBuilder('option')
      .select(['option.name', 'option.value'])
      .getMany();
  }

  async findByNames(names: string[]) {
    return this.optionRepository
      .createQueryBuilder('option')
      .select(['option.name', 'option.value', 'option.type'])
      .where('option.name IN (:...names)', { names })
      .getMany();
  }

  stringify(option: Option): string {
    if (option.type === 'number' || option.type === 'currency') {
      const intValue = parseInt(option.value);
      return isNaN(intValue) ? null : intValue.toString();
    }

    return option.value.toString();
  }

  parse(option: Option): any {
    if (option.type === 'number' || option.type === 'currency') {
      const intValue = parseInt(option.value);
      return isNaN(intValue) ? 0 : intValue;
    } else if (option.type === 'array') {
      return JSON.parse(option.value);
    }

    return option.value;
  }

  fromPairs(options: Option[]): Record<string, any> {
    const res = {};

    options.forEach((opt) => {
      res[opt.name] = this.parse(opt);
    });

    return res;
  }
}
