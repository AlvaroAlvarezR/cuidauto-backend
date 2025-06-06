import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Maintenance } from '../maintenances/entities/maintenance.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class MaintenanceStatusService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Maintenance) private maintenanceRepo: Repository<Maintenance>,
  ) { }

  async getVehicleStatus(vehicleId: number) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const maintenances = await this.maintenanceRepo.find({
      where: { vehicle: { id: vehicleId } },
      order: { date: 'DESC' },
    });

    const now = dayjs();
    const currentMileage = vehicle.mileage;

    const types = ['oil', 'brakes', 'tires', 'battery', 'belt', 'cooling'] as const;

    const status = types.map((type) => {
      const last = maintenances.find((m) => m.type === type);
      if (!last) {
        return {
          type,
          status: 'danger',
          reason: 'No history found',
        };
      }

      let dateStatus: 'ok' | 'warning' | 'danger' = 'ok';
      let mileageStatus: 'ok' | 'warning' | 'danger' = 'ok';

      if (last.expectedDate) {
        const expected = dayjs(last.expectedDate);
        if (now.isAfter(expected)) {
          dateStatus = 'danger';
        } else if (now.isAfter(expected.subtract(1, 'month'))) {
          dateStatus = 'warning';
        }
      }

      if (typeof last.expectedMileage === 'number') {
        if (currentMileage > last.expectedMileage) {
          mileageStatus = 'danger';
        } else if (currentMileage > last.expectedMileage - 500) {
          mileageStatus = 'warning';
        }
      }

      const combinedStatus =
        dateStatus === 'danger' || mileageStatus === 'danger'
          ? 'danger'
          : dateStatus === 'warning' || mileageStatus === 'warning'
            ? 'warning'
            : 'ok';

      return {
        type,
        status: combinedStatus,
        lastDate: last.date,
        expectedDate: last.expectedDate,
        expectedMileage: last.expectedMileage,
        currentMileage,
      };
    });

    const globalStatus = status.some((s) => s.status === 'danger')
      ? 'danger'
      : status.some((s) => s.status === 'warning')
        ? 'warning'
        : 'ok';

    return {
      vehicleId,
      globalStatus,
      status,
    };
  }
}
