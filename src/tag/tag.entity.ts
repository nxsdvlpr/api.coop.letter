import { Factory } from 'nestjs-seeder';
import { Letter } from 'src/letter/letter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LetterTag } from './letter-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Letter, (letter) => letter.tags)
  letters: Letter[];

  @OneToMany(() => LetterTag, (letterTag) => letterTag.tag)
  letterTags: LetterTag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Factory(
    (faker) =>
      `${faker.commerce
        .department()
        .toLowerCase()} (${faker.random.alphaNumeric(3)})`,
  )
  @Column({ unique: true })
  label: string;

  @Factory((faker, ctx) => faker.helpers.slugify(ctx.label))
  @Column({ unique: true })
  slug: string;
}
