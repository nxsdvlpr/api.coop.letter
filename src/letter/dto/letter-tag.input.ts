import { InputType, PickType } from '@nestjs/graphql';
import { TagInput } from 'src/tag/dto/tag.input';

@InputType()
export class LetterTagInput extends PickType(TagInput, [
  'id',
  'label',
] as const) {}
