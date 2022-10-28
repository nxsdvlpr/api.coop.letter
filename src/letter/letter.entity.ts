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
import { Tag } from 'src/tag/tag.entity';
import { LetterTag } from 'src/tag/letter-tag.entity';
import { Company } from 'src/company/company.entity';
import { City } from 'src/city/city.entity';
import { Author } from 'src/author/author.entity';

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

  @ManyToOne(() => Author, (author) => author.letters, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  author: Author;

  @Column()
  authorId: string;

  @ManyToOne(() => City, (city) => city.letters, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  city: City;

  @Column({ nullable: true })
  cityId: string;

  @ManyToOne(() => Company, (company) => company.letters, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: string;

  @Column()
  type: string;

  @Column()
  category: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column({ nullable: true })
  attachment: string;

  @ManyToMany(() => Tag, (tag) => tag.letters, {
    cascade: true,
  })
  @JoinTable({ name: 'letter_tag' })
  tags!: Tag[];

  @OneToMany(() => LetterTag, (letterTag) => letterTag.letter)
  letterTags!: LetterTag[];
}
