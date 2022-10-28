import { InputType, OmitType } from '@nestjs/graphql';
import { AuthorInput } from './author.input';

@InputType()
export class CreateAuthorInput extends OmitType(AuthorInput, ['id'] as const) {}
