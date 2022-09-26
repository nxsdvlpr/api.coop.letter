import {
  FilterableField,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Option')
@QueryOptions({ enableTotalCount: true })
export class OptionDto {
  @IDField(() => ID)
  id: number;

  @FilterableField()
  name: string;

  @FilterableField()
  label: string;

  @FilterableField({ nullable: true })
  value: string;

  @FilterableField()
  type: string;
}
