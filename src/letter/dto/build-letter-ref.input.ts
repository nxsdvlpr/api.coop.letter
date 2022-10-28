import { Field, InputType, PickType } from '@nestjs/graphql';
import { LetterInput } from './letter.input';

@InputType()
export class BuildLetterRefInput extends PickType(LetterInput, [
  'companyId',
  'type',
  'category',
] as const) {
  @Field({
    defaultValue: null,
  })
  refNo: string;
}
