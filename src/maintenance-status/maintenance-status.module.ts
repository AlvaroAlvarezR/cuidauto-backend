import { Module } from '@nestjs/common';
import { MaintenanceStatusService } from './maintenance-status.service';
import { MaintenanceStatusController } from './maintenance-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Maintenance } from '../maintenances/entities/maintenance.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { MaintenancesModule } from '../maintenances/maintenances.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Maintenance]),
    VehiclesModule,
    MaintenancesModule,
  ],
  controllers: [MaintenanceStatusController],
  providers: [MaintenanceStatusService],
})
export class MaintenanceStatusModule { }