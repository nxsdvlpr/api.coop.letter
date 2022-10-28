import {
  FilterableField,
  FilterableRelation,
  FilterableUnPagedRelation,
  IDField,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Directive, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { AuthorDto } from 'src/author/dto/author.dto';
import { CityDto } from 'src/city/dto/city.dto';
import { SiDScalar } from 'src/common/sid.scalar';
import { CompanyDto } from 'src/company/dto/company.dto';
import { TagDto } from 'src/tag/dto/tag.dto';
import { UserDto } from 'src/user/dto/user.dto';

@ObjectType('Letter')
@Directive('@key(fields: "id")')
@QueryOptions({ enableTotalCount: true })
@FilterableRelation('author', () => AuthorDto, {
  disableRemove: true,
  nullable: true,
})
@FilterableRelation('city', () => CityDto, {
  disableRemove: true,
  nullable: true,
})
@FilterableRelation('company', () => CompanyDto, {
  disableRemove: true,
})
@FilterableRelation('user', () => UserDto, {
  disableRemove: true,
})
@FilterableUnPagedRelation('tags', () => TagDto, {
  disableRemove: true,
})
export class LetterDto {
  @IDField(() => SiDScalar)
  id: string;

  @FilterableField(() => SiDScalar)
  userId: string;

  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @FilterableField()
  ref: string;

  @FilterableField()
  publishedDate: string;

  @FilterableField(() => SiDScalar, { nullable: true })
  authorId: string;

  @FilterableField(() => SiDScalar, { nullable: true })
  cityId: string;

  @FilterableField(() => SiDScalar)
  companyId: string;

  @FilterableField()
  type: string;

  @FilterableField()
  category: string;

  @FilterableField()
  to: string;

  @FilterableField()
  subject: string;

  @FilterableField({ nullable: true })
  attachment: string;
}
