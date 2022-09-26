import {
  FilterableField,
  FilterableRelation,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Directive, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { UserDto } from 'src/user/dto/user.dto';

@ObjectType('Letter')
@Directive('@key(fields: "id")')
@QueryOptions({ enableTotalCount: true })
@FilterableRelation('user', () => UserDto, {
  disableRemove: true,
})
export class LetterDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => SiDScalar)
  userId: string;

  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  ref: string;

  @FilterableField()
  subject: string;
}
