import { Test, TestingModule } from '@nestjs/testing';
import { PsuCalculatorService} from './psu_calculator.service';

describe('PsuCalculatorService', () => {
  let service: PsuCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsuCalculatorService],
    }).compile();

    service = module.get<PsuCalculatorService>(PsuCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
