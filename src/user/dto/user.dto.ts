import {
  Authorize,
  BeforeCreateOne,
  BeforeUpdateOne,
  FilterableField,
  FilterableRelation,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import {
  Field,
  GraphQLISODateTime,
  ObjectType,
  Directive,
} from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { RoleDto } from 'src/role/dto/role.dto';
import { UserBeforeCreateHook } from '../hooks/user-berfore-create.hook';
import { UserBeforeUpdateHook } from '../hooks/user-berfore-update.hook';
import { UserAuthorizer } from '../user.authorizer';

@ObjectType('User')
@Directive('@key(fields: "id")')
@Authorize(UserAuthorizer)
@BeforeCreateOne(UserBeforeCreateHook)
@BeforeUpdateOne(UserBeforeUpdateHook)
@QueryOptions({ enableTotalCount: true })
@FilterableRelation('role', () => RoleDto, {
  disableRemove: true,
})
export class UserDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => SiDScalar)
  roleId: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  username: string;

  @FilterableField()
  name: string;

  @FilterableField({ nullable: true })
  phone: string;

  @FilterableField({ nullable: true })
  avatar: string;
}
