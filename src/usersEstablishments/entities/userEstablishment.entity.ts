import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';

@Entity('users_establishments')
export class UserEstablishment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.roles, { eager: true })
  user: User;

  @ManyToOne(() => Establishment, establishment => establishment.users, { eager: true })
  establishment: Establishment;

  @Column({ name: 'role', width: 1 })
  role: number;
}