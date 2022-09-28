import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeleteManyResponse } from '@nestjs-query/core';
import { LetterDto } from './dto/letter.dto';
import { LetterService } from './letter.service';
import { CreateLetterInput } from './dto/create-letter.input';
import { UpdateLetterInput } from './dto/update-letter.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SiDScalar } from 'src/common/sid.scalar';

import { DeleteManyResponseType } from '@nestjs-query/query-graphql';
import { BuildLetterRefInput } from './dto/build-letter-ref.input';

@Resolver(() => LetterDto)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

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

  @Mutation(() => DeleteManyResponseType())
  async deleteManyLetters(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args({ name: 'ids', type: () => [SiDScalar] }) ids: string[],
  ): Promise<DeleteManyResponse> {
    return this.letterService.deleteByIds(authUser, ids);
  }

  @Query(() => String)
  async buildLetterRef(
    @Args('input') input: BuildLetterRefInput,
  ): Promise<string> {
    return this.letterService.buildRef(input);
  }
}
