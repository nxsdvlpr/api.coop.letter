import { InputType, OmitType } from '@nestjs/graphql';
import { LetterInput } from './letter.input';

@InputType()
export class CreateLetterInput extends OmitType(LetterInput, [
  'id',
] as const) { }
