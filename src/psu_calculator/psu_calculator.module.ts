import { Module } from '@nestjs/common';
import { PsuCalculatorService } from './psu_calculator.service';
import { PsuCalculatorController } from './psu_calculator.controller';
import { Component } from './entities/component.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentPower } from './entities/component-power.entity';
import { Power } from './entities/power.entity'
import { User } from './entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'RIP',  
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Component, Power, ComponentPower, User])
  ],
  controllers: [PsuCalculatorController], // Здесь указываем контроллеры, которые будут частью модуля
  providers: [PsuCalculatorService] // Здесь указываем сервисы (провайдеры), доступные в модуле
})
export class PsuCalculatorModule {}