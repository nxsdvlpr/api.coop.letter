import { Factory } from 'nestjs-seeder';
import { Letter } from 'src/letter/letter.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


import { Tag } from './tag.entity';

@Entity()
export class LetterTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory((faker) => faker.random.number({ min: 1, max: 100 }))
  @Column()
  letterId: number;

  @ManyToOne(() => Letter, (letter) => letter.letterTags, {
    nullable: false,
  })
  @JoinColumn()
  letter: Letter;

  @Factory((faker) => faker.random.number({ min: 1, max: 5 }))
  @Column()
  tagId: number;

  @ManyToOne(() => Tag, (tag) => tag.letters, {
    nullable: false,
  })
  @JoinColumn()
  tag: Letter;
}
