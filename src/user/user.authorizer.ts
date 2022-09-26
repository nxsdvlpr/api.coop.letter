import { Injectable } from '@nestjs/common';
import { CustomAuthorizer } from '@nestjs-query/query-graphql';
import { Filter } from '@nestjs-query/core';
import { UserDto } from './dto/user.dto';
import { UserContext } from 'src/auth/auth.interfaces';

@Injectable()
export class UserAuthorizer implements CustomAuthorizer<UserDto> {
  authorize(context: UserContext): Promise<Filter<UserDto>> {
    if (context.req.user.role.shortname === 'admin') {
      return Promise.resolve({});
    }

    return Promise.resolve({ id: { eq: context.req.user.id } });
  }
}
