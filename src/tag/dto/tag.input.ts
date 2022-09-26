import { Field, ID, InputType } from '@nestjs/graphql';

@InputType('TagInput')
export class TagInput {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  label: string;

  @Field({ nullable: true })
  slug: string;
}
