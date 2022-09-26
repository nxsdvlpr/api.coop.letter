import {
  Authorize,
  FilterableField,
  FilterableUnPagedRelation,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { SiDScalar } from 'src/common/sid.scalar';
import { UserDto } from 'src/user/dto/user.dto';
import { RoleAuthorizer } from '../role.authorizer';

@ObjectType('Role')
@Authorize(RoleAuthorizer)
@QueryOptions({ enableTotalCount: true })
@FilterableUnPagedRelation('users', () => UserDto, {
  disableRemove: true,
})
export class RoleDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  name: string;

  @FilterableField()
  shortname: string;

  @FilterableField(() => GraphQLJSON, { nullable: true })
  access: any;
}
