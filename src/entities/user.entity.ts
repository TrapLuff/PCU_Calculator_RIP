import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Power } from './power.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ length: 64 })
  login: string;

  @Column({ length: 128 })
  password: string;

  @Column({ length: 20 })
  role: string;

  @Column({ length: 150, name: 'full_name' })
  fullName: string;

  // связи с builds
  @OneToMany(() => Power, power => power.creator)
  createdPowers: Power[];

  @OneToMany(() => Power, power => power.moderator)
  moderatedPowers: Power[];
}