import { Entrance } from 'src/entrances/entities/entrance.entity';
import { UserEstablishment } from 'src/usersEstablishments/entities/userEstablishment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('establishments')
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

  @OneToMany(() => Entrance, entrances => entrances.establishment)
  entrances: Promise<Entrance[]>;
}