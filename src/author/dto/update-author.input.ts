import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { AuthorInput } from './author.input';

@InputType()
export class UpdateAuthorData extends PartialType(OmitType(AuthorInput, [])) {}

@InputType()
export class UpdateAuthorInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateAuthorData)
  update: UpdateAuthorData;
}
