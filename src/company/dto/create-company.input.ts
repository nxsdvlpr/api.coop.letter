import { InputType, OmitType } from '@nestjs/graphql';
import { CompanyInput } from './company.input';

@InputType()
export class CreateCompanyInput extends OmitType(CompanyInput, [
  'id',
] as const) {}
