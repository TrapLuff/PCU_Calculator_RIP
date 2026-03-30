import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentsController } from './controllers/components.controller';
import { ComponentsService } from './services/components.service';
import { Component } from '../../entities/component.entity';
import { ComponentsRepository } from 'src/modules/components/repositories/component.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  controllers: [ComponentsController],
  providers: [ComponentsService, ComponentsRepository],
  exports: [ComponentsService],
})
export class ComponentsModule {}