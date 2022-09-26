import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  value: string;

  @Column()
  type: string;
}
