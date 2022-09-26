import { Injectable } from '@nestjs/common';
import { CustomAuthorizer } from '@nestjs-query/query-graphql';
import { Filter } from '@nestjs-query/core';

import { RoleDto } from './dto/role.dto';
import { UserContext } from 'src/auth/auth.interfaces';

@Injectable()
export class RoleAuthorizer implements CustomAuthorizer<RoleDto> {
  authorize(context: UserContext): Promise<Filter<RoleDto>> {
    if (context.req.user.role.shortname === 'admin') {
      return Promise.resolve({});
    }

    return Promise.resolve({ id: { eq: context.req.user.role.id } });
  }
}
