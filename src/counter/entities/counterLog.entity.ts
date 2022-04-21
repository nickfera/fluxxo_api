import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Establishment } from 'src/establishments/entities/establishment.entity';

@Entity('counterLogs')
export class CounterLog {
  @PrimaryGeneratedColumn({ name: 'uuid' })
  uuid: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'json', type: 'json' })
  json: object;

  @ManyToOne(() => Establishment)
  establishment: Establishment;
}