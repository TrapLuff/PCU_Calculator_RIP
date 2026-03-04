import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Build } from './build.entity';

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
  @OneToMany(() => Build, build => build.creator)
  createdBuilds: Build[];

  @OneToMany(() => Build, build => build.moderator)
  moderatedBuilds: Build[];
}