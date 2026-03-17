import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ComponentPower } from './component-power.entity';

@Entity('powers')
export class Power {
  @PrimaryGeneratedColumn({ name: 'power_id' })
  id: number;

  @Column({ length: 20 })
  status: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt: Date;

  @Column({ nullable: true, name: 'moderator_id' })
  moderatorId?: number;

  @ManyToOne(() => User, user => user.moderatedPowers, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'moderator_id' })
  moderator?: User;

  @Column({ name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() => User, user => user.createdPowers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column()
  efficiency: number;

  @OneToMany(() => ComponentPower, cp => cp.power)
  componentPowers: ComponentPower[];
}