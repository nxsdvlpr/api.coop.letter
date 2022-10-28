import { assign } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateAuthorInput } from './dto/create-author.input';
import { Author } from './author.entity';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { QuickOrm } from 'src/utils';

@QueryService(Author)
export class AuthorService extends TypeOrmQueryService<Author> {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {
    super(authorRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateAuthorInput,
  ): Promise<Author> {
    const data = assign(new Author(), input);

    const author = new QuickOrm(this.authorRepository);

    return author.create(data);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateAuthorInput,
  ): Promise<Author> {
    const data = {
      id: input.id,
      update: assign(new Author(), input.update),
    };

    const author = new QuickOrm(this.authorRepository);

    return author.update(data);
  }
}
