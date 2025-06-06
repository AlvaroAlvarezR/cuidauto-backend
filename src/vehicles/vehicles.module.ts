import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { UsersModule } from '../users/users.module';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Maintenance]), UsersModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule { }