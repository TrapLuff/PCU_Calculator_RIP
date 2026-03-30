import { Test, TestingModule } from '@nestjs/testing';
import { PowersController } from './powers.controller';
import { PowersService } from '../services/powers.service';

describe('PowersController', () => {
  let controller: PowersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowersController],
      providers: [
        { provide: PowersService, useValue: {} }, // мок сервиса
      ],
    }).compile();

    controller = module.get<PowersController>(PowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});