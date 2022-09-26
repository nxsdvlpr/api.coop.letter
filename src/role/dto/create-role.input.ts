import { InputType, OmitType } from '@nestjs/graphql';
import { RoleInput } from './role.input';

@InputType()
export class CreateRoleInput extends OmitType(RoleInput, ['id'] as const) {}
