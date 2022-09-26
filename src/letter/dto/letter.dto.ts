import {
  FilterableField,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Directive, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';

@ObjectType('Letter')
@Directive('@key(fields: "id")')
@QueryOptions({ enableTotalCount: true })
export class LetterDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  title: string;

  @FilterableField({ nullable: true })
  description: string;

  @FilterableField()
  price: number;

  @FilterableField({ nullable: true })
  image: string;

  @FilterableField()
  isActive: boolean;
}
