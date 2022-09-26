import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SiDScalar } from 'src/common/sid.scalar';
import { RoleInput } from './role.input';

@InputType()
export class UpdateRoleData extends PartialType(RoleInput) {}

@InputType()
export class UpdateRoleInput {
  @Field(() => SiDScalar)
  id: string;

  @Field(() => UpdateRoleData)
  @Type(() => UpdateRoleData)
  @ValidateNested()
  update: UpdateRoleData;
}
