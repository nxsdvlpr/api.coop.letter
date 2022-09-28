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

  @Column({ unique: true })
  label: string;

  @Column({ unique: true })
  slug: string;
}
