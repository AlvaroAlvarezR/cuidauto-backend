import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceStatusService } from './maintenance-status.service';

describe('MaintenanceStatusService', () => {
  let service: MaintenanceStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceStatusService],
    }).compile();

    service = module.get<MaintenanceStatusService>(MaintenanceStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
