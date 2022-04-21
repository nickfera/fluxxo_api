import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { UserEstablishment } from 'src/usersEstablishments/entities/userEstablishment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'status', length: 1, default: 'A' })
  status: string;

  @OneToMany(() => UserEstablishment, role => role.user)
  roles: Promise<UserEstablishment[]>;
}