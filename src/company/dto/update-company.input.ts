import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { CompanyInput } from './company.input';

@InputType()
export class UpdateCompanyData extends PartialType(
  OmitType(CompanyInput, []),
) {}

@InputType()
export class UpdateCompanyInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateCompanyData)
  update: UpdateCompanyData;
}
