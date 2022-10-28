import { IDField } from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';

@InputType()
export class LetterInput {
  @IDField(() => SiDScalar)
  id: string;

  @Field()
  ref: string;

  @Field()
  publishedDate: string;

  @Field(() => SiDScalar, { nullable: true })
  authorId: string;

  @Field(() => SiDScalar, { nullable: true })
  cityId: string;

  @Field(() => SiDScalar)
  companyId: string;

  @Field()
  type: string;

  @Field()
  category: string;

  @Field()
  to: string;

  @Field()
  subject: string;

  @Field({ nullable: true })
  attachment: string;
}
