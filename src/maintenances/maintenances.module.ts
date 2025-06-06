// src/maintenances/maintenances.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenancesService } from './maintenances.service';
import { MaintenancesController } from './maintenances.controller';
import { Maintenance } from './entities/maintenance.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance, Vehicle])], // 👈 importante
  controllers: [MaintenancesController],
  providers: [MaintenancesService],
})
export class MaintenancesModule { }