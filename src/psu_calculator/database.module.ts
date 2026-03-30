import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Component } from '../entities/component.entity';
import { Power } from '../entities/power.entity';
import { ComponentPower } from '../entities/component-power.entity';
import { User } from '../entities/user.entity';

import { ComponentsRepository } from '../modules/components/repositories/component.repository';
import { PowerRepository } from '../modules/powers/repositories/power.repository';
import { ComponentPowerRepository } from '../modules/components-powers/repositories/component-power.repository';
import { UserRepository } from '../modules/users/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Component,
      Power,
      ComponentPower,
      User,
    ]),
  ],
  providers: [
    ComponentsRepository,
    PowerRepository,
    ComponentPowerRepository,
    UserRepository,
  ],
  exports: [
    ComponentsRepository,
    PowerRepository,
    ComponentPowerRepository,
    UserRepository,
  ],
})
export class DatabaseModule {}