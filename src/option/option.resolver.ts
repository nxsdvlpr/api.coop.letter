import { Args, Mutation, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { OptionDto } from './dto/option.dto';
import { UpdateOptionInput } from './dto/update-option.input';
import { OptionService } from './option.service';

@Resolver(() => OptionDto)
export class OptionResolver {
  constructor(private readonly optionService: OptionService) {}

  @Mutation(() => GraphQLJSON)
  async updateOptions(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input', { type: () => UpdateOptionInput }) input: UpdateOptionInput,
  ): Promise<any> {
    return this.optionService.updateOptions(authUser, input);
  }
}
