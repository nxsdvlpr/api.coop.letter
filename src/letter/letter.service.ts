import { assign, uniq } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService, DeleteManyResponse } from '@nestjs-query/core';

import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { CreateLetterInput } from './dto/create-letter.input';
import { Letter } from './letter.entity';
import { UpdateLetterInput } from './dto/update-letter.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { leadingZero, QuickOrm, romanize } from 'src/utils';
import { CommonService } from 'src/common/common.service';
import { format } from 'date-fns';
import { CompanyService } from 'src/company/company.service';
import { BuildLetterRefInput } from './dto/build-letter-ref.input';

@QueryService(Letter)
export class LetterService extends TypeOrmQueryService<Letter> {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
    private readonly companyService: CompanyService,
    private readonly commonService: CommonService,
  ) {
    super(letterRepository);
  }

  async create(
    authUser: AuthenticatedUser,
    input: CreateLetterInput,
  ): Promise<Letter> {
    const data = assign(new Letter(), input);

    data.userId = authUser.id;

    const letter = new QuickOrm(this.letterRepository).addRelation('tags');

    letter.beforeRelationCreate((relation, el) => {
      if (relation === 'tags' && !el.id) {
        el.slug = this.commonService.slugify(el.label);
      }
    });

    const newLetter = await letter.create(data);

    await this.setCompanyCounter(data.companyId);

    return newLetter;
  }

  async update(
    authUser: AuthenticatedUser,
    input: UpdateLetterInput,
  ): Promise<Letter> {
    const data = {
      id: input.id,
      update: assign(new Letter(), input.update),
    };

    const letter = new QuickOrm(this.letterRepository).addRelation('tags');

    const oldLetter = await letter.findOne(data.id);

    letter.beforeRelationUpdate((relation, el) => {
      if (relation === 'tags' && !el.id) {
        el.slug = this.commonService.slugify(el.label);
      }
    });

    const updatedLetter = await letter.update(data);

    if (oldLetter.companyId !== updatedLetter.companyId) {
      await this.setCompanyCounter(oldLetter.companyId);
    }

    await this.setCompanyCounter(updatedLetter.companyId);

    return updatedLetter;
  }

  async deleteByIds(
    authUser: AuthenticatedUser,
    ids: string[],
  ): Promise<DeleteManyResponse> {
    let deletedCount = 0;
    const companyIds = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const letter = await this.letterRepository.findOne(id);
      if (letter) {
        await this.letterRepository.delete(id);
        companyIds.push(letter.companyId);
        deletedCount++;
      }
    }

    const uniqueCompanyIds = uniq(companyIds);

    for (let i = 0; i < uniqueCompanyIds.length; i++) {
      const uniqueCompanyId = uniqueCompanyIds[i];
      await this.setCompanyCounter(uniqueCompanyId);
    }

    return {
      deletedCount,
    };
  }

  async buildRef(input: BuildLetterRefInput): Promise<string> {
    const company = await this.companyService.repo.findOne(input.companyId);

    const year = format(new Date(), 'Y');
    const monthRoman = romanize(format(new Date(), 'M'));

    const category = input.category;
    const companyCode = company.code;
    const companyCounter = company.counter + 1;
    const letterNumber = input.refNo || leadingZero(companyCounter, 4);

    return `${category}/${letterNumber}/${companyCode}-IF/${monthRoman}/${year}`;
  }

  private async getLastRefNo(companyId: string) {
    const result = await this.letterRepository
      .createQueryBuilder('letter')
      .select('MAX(CAST(SUBSTRING(letter.ref, 3, 4) AS INT))')
      .where('letter.companyId = :companyId', {
        companyId,
      })
      .getRawOne();

    return result?.max || 0;
  }

  private async setCompanyCounter(companyId: string) {
    const lastRefNo = await this.getLastRefNo(companyId);
    await this.companyService.setCounter(companyId, lastRefNo);
  }
}
