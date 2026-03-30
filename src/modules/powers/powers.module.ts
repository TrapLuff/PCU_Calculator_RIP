import { Module } from '@nestjs/common';
import { PowersController } from './controllers/powers.controller';
import { PowersService } from './services/powers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Power } from 'src/entities/power.entity';
import { PowerRepository } from 'src/modules/powers/repositories/power.repository';

@Module({
imports: [
    TypeOrmModule.forFeature([Power]), 
  ],
  controllers: [PowersController],
  providers: [PowersService, PowerRepository],
  exports: [PowersService, PowerRepository],
})
export class PowersModule {}