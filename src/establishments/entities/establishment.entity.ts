import { UserEstablishment } from 'src/usersEstablishments/entities/userEstablishment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['registry'])
export class Establishment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'corporateName' })
  corporateName: string;

  @Column({ name: 'tradeName' })
  tradeName: string;

  @Column({ name: 'registry', unique: true })
  registry: string;

  @Column({ name: 'status', length: 1, default: 'A' })
  status: string;

  @OneToMany(() => UserEstablishment, users => users.establishment)
  users: UserEstablishment[];
}