import { Test, TestingModule } from '@nestjs/testing';
import { PsuCalculatorController } from './psu_calculator.controller';

describe('PsuCalculatorController', () => {
  let controller: PsuCalculatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsuCalculatorController],
    }).compile();

    controller = module.get<PsuCalculatorController>(PsuCalculatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
