import { Field, InputType, OmitType } from '@nestjs/graphql';
import { LetterTagInput } from './letter-tag.input';
import { LetterInput } from './letter.input';

@InputType()
export class CreateLetterInput extends OmitType(LetterInput, [
  'id',
] as const) {

  @Field(() => [LetterTagInput])
  tags: LetterTagInput[];
}
