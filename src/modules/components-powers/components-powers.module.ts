import { Module } from '@nestjs/common';
import { ComponentPowerController } from './controllers/components-powers.controller';
import { ComponentPowerService } from './services/components-powers.service';
import { DatabaseModule } from '../../psu_calculator/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ComponentPowerController],
  providers: [ComponentPowerService],
})
export class ComponentsPowersModule {}