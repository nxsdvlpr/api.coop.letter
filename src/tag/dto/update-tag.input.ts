import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TagInput } from './tag.input';

@InputType()
export class UpdateTagData extends PartialType(TagInput) {}

@InputType()
export class UpdateTagInput {
  @Field(() => ID)
  id: number;

  @Field(() => UpdateTagData)
  @Type(() => UpdateTagData)
  @ValidateNested()
  update: UpdateTagData;
}
