import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceStatusController } from './maintenance-status.controller';
import { MaintenanceStatusService } from './maintenance-status.service';

describe('MaintenanceStatusController', () => {
  let controller: MaintenanceStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceStatusController],
      providers: [MaintenanceStatusService],
    }).compile();

    controller = module.get<MaintenanceStatusController>(MaintenanceStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
