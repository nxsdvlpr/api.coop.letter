import { IDField } from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';

@InputType()
export class UserInput {
  @IDField(() => SiDScalar)
  id: string;

  @Field(() => SiDScalar)
  roleId: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  avatar: string;
}
