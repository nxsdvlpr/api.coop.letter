import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { Role } from './role.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { assign } from 'lodash';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';

@QueryService(Role)
export class RoleService extends TypeOrmQueryService<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateRoleInput,
  ): Promise<Role> {
    if (authUser.role.shortname !== 'admin') {
      throw new BadRequestException(
        'You are not allowed to perform this action',
      );
    }

    const role = assign(new Role(), input);
    return this.roleRepository.save(role);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateRoleInput,
  ): Promise<Role> {
    if (authUser.role.shortname !== 'admin') {
      throw new BadRequestException(
        'You are not allowed to perform this action',
      );
    }

    const role = await this.roleRepository.findOne(input.id);

    if (!role) {
      throw new NotFoundException(`Unable to find Role with id: ${input.id}`);
    }

    assign(role, input.update);
    return this.roleRepository.save(role);
  }
}
