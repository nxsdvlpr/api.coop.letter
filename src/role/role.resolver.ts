import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => RoleDto)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}
  @Mutation(() => RoleDto)
  async createRole(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateRoleInput,
  ): Promise<RoleDto> {
    return this.roleService.create(authUser, input);
  }

  @Mutation(() => RoleDto)
  async updateRole(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateRoleInput,
  ): Promise<RoleDto> {
    return this.roleService.update(authUser, input);
  }
}
