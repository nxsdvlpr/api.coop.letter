import { InputType, OmitType } from '@nestjs/graphql';
import { CityInput } from './city.input';

@InputType()
export class CreateCityInput extends OmitType(CityInput, ['id'] as const) {}
