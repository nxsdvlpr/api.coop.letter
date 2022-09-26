import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateOptionInput {
  @Field(() => GraphQLJSON, { nullable: true })
  options: Record<string, any>;
}
