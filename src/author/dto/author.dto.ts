import {
  FilterableField,
  FilterableUnPagedRelation,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Directive, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { LetterDto } from 'src/letter/dto/letter.dto';

@ObjectType('Author')
@Directive('@key(fields: "id")')
@QueryOptions({ enableTotalCount: true })
@FilterableUnPagedRelation('letters', () => LetterDto, {
  disableRemove: true,
})
export class AuthorDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  name: string;
}
