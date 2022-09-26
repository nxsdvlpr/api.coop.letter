
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/user/user.entity';
import { Tag } from 'src/tag/tag.entity'
import { LetterTag } from 'src/tag/letter-tag.entity';

@Entity()
export class Letter {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.letters, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @Column()
  ref: string;

  @Column({ type: 'date' })
  publishedDate: string;

  @Column()
  city: string;

  @Column()
  destination: string;

  @Column()
  subject: string;

  @ManyToMany(() => Tag, (tag) => tag.letters, {
    cascade: true,
  })
  @JoinTable({ name: 'letter_tag' })
  tags!: Tag[];

  @OneToMany(() => LetterTag, (letterTag) => letterTag.letter)
  letterTags!: LetterTag[];
}
