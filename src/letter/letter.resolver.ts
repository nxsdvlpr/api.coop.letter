import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LetterDto } from './dto/letter.dto';
import { LetterService } from './letter.service';
import { CreateLetterInput } from './dto/create-letter.input';
import { UpdateLetterInput } from './dto/update-letter.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => LetterDto)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) { }

  @Mutation(() => LetterDto)
  async createLetter(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateLetterInput,
  ): Promise<LetterDto> {
    return this.letterService.create(authUser, input);
  }

  @Mutation(() => LetterDto)
  async updateLetter(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateLetterInput,
  ): Promise<LetterDto> {
    return this.letterService.update(authUser, input);
  }
}
