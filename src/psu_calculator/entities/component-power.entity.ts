import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import { Component } from './component.entity';
import { Power } from './power.entity';

@Entity('components_powers')
export class ComponentPower {
  @PrimaryColumn({ name: 'component_id' })
  componentId: number;

  @PrimaryColumn({ name: 'power_id' })
  powerId: number;

  @ManyToOne(() => Component, component => component.componentPowers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(() => Power, power => power.componentPowers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'power_id' })
  power: Power;

  @Column({ nullable: true }) 
  quantity: number;
}