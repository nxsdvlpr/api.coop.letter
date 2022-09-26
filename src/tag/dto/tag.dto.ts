import {
  FilterableUnPagedRelation,
  FilterableField,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { LetterDto } from 'src/letter/dto/letter.dto';
@ObjectType('Tag')
@QueryOptions({ enableTotalCount: true })
@FilterableUnPagedRelation('letters', () => LetterDto, {
  disableRemove: true,
})
export class TagDto {
  @IDField(() => ID)
  id: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  label: string;

  @FilterableField()
  slug: string;
}
