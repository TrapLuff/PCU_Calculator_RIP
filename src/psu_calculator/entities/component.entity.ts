import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ComponentBuild } from './component-build.entity';

@Entity('components')
export class Component {
  @PrimaryGeneratedColumn({ name: 'component_id' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, name: 'image_url', nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 50, name: 'video_url', nullable: true })
  video?: string;

  @Column({ type: 'int', name: 'tdp_typical' })
  tdp_typical: number;

  @Column({ type: 'int', name: 'tdp_up' })
  tdp_up: number;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @OneToMany(() => ComponentBuild, cb => cb.component)
  componentBuilds: ComponentBuild[];
}