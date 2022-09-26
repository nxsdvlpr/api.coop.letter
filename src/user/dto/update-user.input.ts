import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SiDScalar } from 'src/common/sid.scalar';
import { UserInput } from './user.input';

@InputType()
export class UpdateUserData extends PartialType(UserInput) {}

@InputType('UpdateUserInput')
export class UpdateUserInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateUserData)
  @Type(() => UpdateUserData)
  @ValidateNested()
  update: UpdateUserData;
}
