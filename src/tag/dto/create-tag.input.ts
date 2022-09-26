import { InputType, OmitType } from '@nestjs/graphql';
import { TagInput } from './tag.input';

@InputType()
export class CreateTagInput extends OmitType(TagInput, [
  'id',
  'slug',
] as const) {}
