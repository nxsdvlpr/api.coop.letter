import { IDField } from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { SiDScalar } from 'src/common/sid.scalar';

@InputType()
export class RoleInput {
  @IDField(() => SiDScalar)
  id: string;

  @Field()
  name: string;

  @Field()
  shortname: string;

  @Field(() => GraphQLJSON, { nullable: true })
  access: string;
}
