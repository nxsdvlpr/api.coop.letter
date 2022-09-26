import { Injectable } from '@nestjs/common';
import {
  BeforeCreateOneHook,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';

import { CommonService } from 'src/common/common.service';

interface CreatedBy {
  password: string;
}

@Injectable()
export class UserBeforeCreateHook<T extends CreatedBy>
  implements BeforeCreateOneHook<T>
{
  constructor(readonly commonService: CommonService) {}

  async run(instance: CreateOneInputType<T>): Promise<CreateOneInputType<T>> {
    instance.input.password = this.commonService.passwordHash(
      instance.input.password,
    );

    return instance;
  }
}
