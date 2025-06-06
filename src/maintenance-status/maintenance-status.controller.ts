import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MaintenanceStatusService } from './maintenance-status.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Maintenance Status')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('vehicles/:id/maintenance-status')
export class MaintenanceStatusController {
  constructor(private readonly service: MaintenanceStatusService) { }

  @Get()
  getStatus(@Param('id') vehicleId: number) {
    return this.service.getVehicleStatus(vehicleId);
  }
}
