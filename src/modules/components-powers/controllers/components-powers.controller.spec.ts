import { Test, TestingModule } from '@nestjs/testing';
import { ComponentPowerController } from './components-powers.controller';
import { ComponentPowerService } from '../services/components-powers.service';

describe('ComponentPowerController', () => {
  let controller: ComponentPowerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentPowerController],
      providers: [
        { provide: ComponentPowerService, useValue: {} }, // мок сервиса
      ],
    }).compile();

    controller = module.get<ComponentPowerController>(ComponentPowerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});