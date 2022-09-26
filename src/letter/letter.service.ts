import { assign } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateLetterInput } from './dto/create-letter.input';
import { Letter } from './letter.entity';
import { UpdateLetterInput } from './dto/update-letter.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { QuickOrm } from 'src/utils';
import { CommonService } from 'src/common/common.service';

@QueryService(Letter)
export class LetterService extends TypeOrmQueryService<Letter> {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
    private readonly commonService: CommonService
  ) {
    super(letterRepository);
  }


  async create(
    authUser: AuthenticatedUser,
    input: CreateLetterInput,
  ): Promise<Letter> {
    const data = assign(new Letter(), input);

    data.userId = authUser.id;

    const letter = new QuickOrm(this.letterRepository)
      .addRelation('tags');

    letter.beforeRelationCreate((relation, el) => {
      if (relation === 'tags' && !el.id) {
        el.slug = this.commonService.slugify(el.label);
      }
    });

    return letter.create(data);
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateLetterInput): Promise<Letter> {
    const data = {
      id: input.id,
      update: assign(new Letter(), input.update)
    };

    const letter = new QuickOrm(this.letterRepository)
      .addRelation('tags');

    letter.beforeRelationUpdate((relation, el) => {
      if (relation === 'tags' && !el.id) {
        el.slug = this.commonService.slugify(el.label);
      }
    });

    return letter.update(data);
  }

}
