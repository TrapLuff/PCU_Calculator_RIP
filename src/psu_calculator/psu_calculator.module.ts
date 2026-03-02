import { Module } from '@nestjs/common';
import { PsuCalculatorService } from './psu_calculator.service';
import { PsuCalculatorController } from './psu_calculator.controller';

@Module({
  controllers: [PsuCalculatorController], // Здесь указываем контроллеры, которые будут частью модуля
  providers: [PsuCalculatorService] // Здесь указываем сервисы (провайдеры), доступные в модуле
})
export class PsuCalculatorModule {}