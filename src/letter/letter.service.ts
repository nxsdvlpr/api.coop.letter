import { assign } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateLetterInput } from './dto/create-letter.input';
import { Letter } from './letter.entity';
import { UpdateLetterInput } from './dto/update-letter.input';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';

@QueryService(Letter)
export class LetterService extends TypeOrmQueryService<Letter> {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
  ) {
    super(letterRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateLetterInput,
  ): Promise<Letter> {
    const letter = assign(new Letter(), input);

    letter.userId = authUser.id

    return this.letterRepository.save(letter);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateLetterInput,
  ): Promise<Letter> {
    const letter = await this.letterRepository.findOne(input.id);

    if (!letter) {
      throw new NotFoundException(
        `Unable to find Letter with id: ${input.id}`,
      );
    }

    assign(letter, input.update);
    return this.letterRepository.save(letter);
  }
}
