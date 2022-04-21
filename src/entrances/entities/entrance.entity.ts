import { Establishment } from "src/establishments/entities/establishment.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('entrances')
export class Entrance {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Establishment)
  establishment: Establishment;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'active' })
  active: boolean;
}