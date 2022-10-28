import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { SiDScalar } from 'src/common/sid.scalar';
import { CityInput } from './city.input';

@InputType()
export class UpdateCityData extends PartialType(OmitType(CityInput, [])) {}

@InputType()
export class UpdateCityInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateCityData)
  update: UpdateCityData;
}
