import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { assign } from 'lodash';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CommonService } from 'src/common/common.service';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';

@QueryService(User)
export class UserService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    readonly commonService: CommonService,
  ) {
    super(userRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateUserInput,
  ): Promise<User> {
    if (authUser.role.shortname !== 'admin') {
      throw new BadRequestException(
        'You are not allowed to perform this action',
      );
    }

    input.password = this.commonService.passwordHash(input.password);

    const user = assign(new User(), input);
    return this.userRepository.save(user);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateUserInput,
  ): Promise<User> {
    if (authUser.role.shortname !== 'admin') {
      throw new BadRequestException(
        'You are not allowed to perform this action',
      );
    }

    const user = await this.userRepository.findOne(input.id);

    if (!user) {
      throw new NotFoundException(`Unable to find User with id: ${input.id}`);
    }

    if (input.update.password && input.update.password.length > 0) {
      input.update.password = this.commonService.passwordHash(
        input.update.password,
      );
    } else {
      delete input.update.password;
    }

    assign(user, input.update);
    return this.userRepository.save(user);
  }

  async findByRoleIds(roleIds: string[]) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.roleId IN (:...roleIds)', { roleIds })
      .getMany();
  }

  async usernameExists(username: string): Promise<boolean> {
    const exists = await this.userRepository.find({ username: username });
    return exists.length > 0 ? true : false;
  }
}
