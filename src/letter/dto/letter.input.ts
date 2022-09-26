import { IDField } from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';

@InputType()
export class LetterInput {
  @IDField(() => SiDScalar)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  image: string;

  @Field()
  isActive: boolean;
}
