import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CityDto } from './dto/city.dto';
import { CityService } from './city.service';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => CityDto)
export class CityResolver {
  constructor(private readonly cityService: CityService) {}

  @Mutation(() => CityDto)
  async createCity(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateCityInput,
  ): Promise<CityDto> {
    return this.cityService.create(authUser, input);
  }

  @Mutation(() => CityDto)
  async updateCity(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateCityInput,
  ): Promise<CityDto> {
    return this.cityService.update(authUser, input);
  }
}
