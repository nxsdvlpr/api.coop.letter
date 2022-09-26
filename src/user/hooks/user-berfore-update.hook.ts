import {
  BeforeUpdateOneHook,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/common.service';

interface UpdatedBy {
  password: string;
}
@Injectable()
export class UserBeforeUpdateHook<T extends UpdatedBy>
  implements BeforeUpdateOneHook<T>
{
  constructor(readonly commonService: CommonService) {}

  async run(instance: UpdateOneInputType<T>): Promise<UpdateOneInputType<T>> {
    if (instance.update.password && instance.update.password.length > 0) {
      instance.update.password = this.commonService.passwordHash(
        instance.update.password,
      );
    } else {
      delete instance.update.password;
    }

    return instance;
  }
}
