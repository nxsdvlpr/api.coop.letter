import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Boolean)
  async usernameExists(@Args('username') username: string): Promise<boolean> {
    return this.userService.usernameExists(username);
  }

  @Mutation(() => UserDto)
  async createUser(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateUserInput,
  ): Promise<UserDto> {
    return this.userService.create(authUser, input);
  }

  @Mutation(() => UserDto)
  async updateUser(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserDto> {
    return this.userService.update(authUser, input);
  }
}
