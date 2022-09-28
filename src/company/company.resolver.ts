import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CompanyDto } from './dto/company.dto';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => CompanyDto)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Mutation(() => CompanyDto)
  async createCompany(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: CreateCompanyInput,
  ): Promise<CompanyDto> {
    return this.companyService.create(authUser, input);
  }

  @Mutation(() => CompanyDto)
  async updateCompany(
    @CurrentUser() authUser: AuthenticatedUser,
    @Args('input') input: UpdateCompanyInput,
  ): Promise<CompanyDto> {
    return this.companyService.update(authUser, input);
  }
}
