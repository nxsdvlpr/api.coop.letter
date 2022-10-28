import { IDField } from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';

@InputType()
export class AuthorInput {
  @IDField(() => SiDScalar)
  id: string;

  @Field()
  name: string;
}
