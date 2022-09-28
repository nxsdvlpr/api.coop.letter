import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { LetterTagInput } from './letter-tag.input';
import { LetterInput } from './letter.input';

@InputType()
export class UpdateLetterData extends PartialType(OmitType(LetterInput, [])) {
  @Field(() => [LetterTagInput])
  tags: LetterTagInput[];
}

@InputType()
export class UpdateLetterInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateLetterData)
  update: UpdateLetterData;
}
