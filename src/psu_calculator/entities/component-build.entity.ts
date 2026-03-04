import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import { Component } from './component.entity';
import { Build } from './build.entity';

@Entity('components_builds')
export class ComponentBuild {
  @PrimaryColumn({ name: 'component_id' })
  componentId: number;

  @PrimaryColumn({ name: 'build_id' })
  buildId: number;

  @ManyToOne(() => Component, component => component.componentBuilds, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(() => Build, build => build.componentBuilds, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'build_id' })
  build: Build;

  @Column()
  quantity: number;

  @Column()
  position: number;
}