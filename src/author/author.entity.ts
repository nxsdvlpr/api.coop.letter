import { Letter } from 'src/letter/letter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @OneToMany(() => Letter, (letter) => letter.author)
  letters: Letter[];
}
