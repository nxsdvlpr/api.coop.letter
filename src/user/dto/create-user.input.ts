import { InputType, OmitType } from '@nestjs/graphql';
import { UserInput } from './user.input';

@InputType('CreateUserInput')
export class CreateUserInput extends OmitType(UserInput, ['id'] as const) {}
