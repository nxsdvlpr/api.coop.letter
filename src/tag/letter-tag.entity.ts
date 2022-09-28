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

  @Column()
  letterId: number;

  @ManyToOne(() => Letter, (letter) => letter.letterTags, {
    nullable: false,
  })
  @JoinColumn()
  letter: Letter;

  @Column()
  tagId: number;

  @ManyToOne(() => Tag, (tag) => tag.letters, {
    nullable: false,
  })
  @JoinColumn()
  tag: Letter;
}
