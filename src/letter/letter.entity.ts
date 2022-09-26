
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/user/user.entity';

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

  @Column()
  subject: string;
}
