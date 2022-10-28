import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthorDto } from './dto/author.dto';
import { AuthorService } from './author.service';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => AuthorDto)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => AuthorDto)
  async createAuthor(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateAuthorInput,
  ): Promise<AuthorDto> {
    return this.authorService.create(authUser, input);
  }

  @Mutation(() => AuthorDto)
  async updateAuthor(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateAuthorInput,
  ): Promise<AuthorDto> {
    return this.authorService.update(authUser, input);
  }
}
