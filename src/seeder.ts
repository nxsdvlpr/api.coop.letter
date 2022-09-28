import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { RoleSeeder } from './role/role.seeder';
import { UserModule } from './user/user.module';
import { UserSeeder } from './user/user.seeder';
import { OptionSeeder } from './option/option.seeder';
import { OptionModule } from './option/option.module';
import { LetterSeeder } from './letter/letter.seeder';
import { LetterModule } from './letter/letter.module';
import { TagModule } from './tag/tag.module';
import { TagSeeder } from './tag/tag.seeder';
import { CompanySeeder } from './company/company.seeder';
import { CompanyModule } from './company/company.module';

seeder({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          namingStrategy: new SnakeNamingStrategy(),
        }),
    }),
    CommonModule,
    OptionModule,
    RoleModule,
    UserModule,
    CompanyModule,
    LetterModule,
    TagModule,
  ],
}).run([
  OptionSeeder,
  RoleSeeder,
  UserSeeder,
  CompanySeeder,
  LetterSeeder,
  TagSeeder,
]);
