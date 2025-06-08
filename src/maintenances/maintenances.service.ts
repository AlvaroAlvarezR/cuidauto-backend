import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { MAINTENANCE_TYPE_TRANSLATIONS } from '../common/constants/maintenance-types';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance) private repo: Repository<Maintenance>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>
  ) { }


  async create(vehicleId: number, dto: CreateMaintenanceDto) {
    const maintenance = this.repo.create({
      ...dto,
      vehicle: { id: vehicleId }
    });
    return this.repo.save(maintenance);
  }

  async findByVehicle(vehicleId: number, page = 1, limit = 10) {
    const [items, total] = await this.repo.findAndCount({
      where: { vehicle: { id: vehicleId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
      relations: ['vehicle'], // Necesario para acceder a vehicle.mileage
    });

    const dataWithStatus = items.map((m) => ({
      ...m,
      typeLabel: MAINTENANCE_TYPE_TRANSLATIONS[m.type],
      status: this.calculateMaintenanceStatus(m, m.vehicle.mileage),
    }));

    return {
      data: dataWithStatus,
      page,
      limit,
      total,
    };
  }

  private calculateMaintenanceStatus(m: Maintenance, vehicleMileage: number): 'ok' | 'warning' | 'urgent' {
    const now = new Date();
    let status: 'ok' | 'warning' | 'urgent' = 'ok';

    // Evaluar expectedMileage
    if (typeof m.expectedMileage === 'number') {
      const diffKm = m.expectedMileage - vehicleMileage;

      if (diffKm <= 0) return 'urgent';
      if (diffKm <= 500) status = 'warning';
    }

    // Evaluar expectedDate
    if (m.expectedDate) {
      const diffDays = (new Date(m.expectedDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays <= 0) return 'urgent';
      if (diffDays <= 30 && status !== 'warning') status = 'warning';
    }

    return status;
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}