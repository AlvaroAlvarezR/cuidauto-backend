import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UsersService } from '../users/users.service';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private repo: Repository<Vehicle>,
    @InjectRepository(Maintenance) private maintenanceRepo: Repository<Maintenance>,
    private usersService: UsersService
  ) { }

  async create(dto: CreateVehicleDto, userId: number) {
    console.log(userId);
    const vehicle = this.repo.create({
      ...dto,
      user: { id: userId }, // TypeORM infiere la relación
    });
    return this.repo.save(vehicle);
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['user', 'maintenances'] });
  }

  findAllByUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, relations: ['maintenances'] });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
  async findAllWithStatus(userId: number, page = 1, limit = 10) {
    const [items, total] = await this.repo.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['maintenances'],
    });

    const dataWithStatus = await Promise.all(
      items.map(async (vehicle) => {
        const status = await this.getGlobalStatus(vehicle);
        return { ...vehicle, status };
      })
    );

    return {
      data: dataWithStatus,
      page,
      limit,
      total,
    };
  }

  private async getGlobalStatus(vehicle: Vehicle): Promise<'ok' | 'warning' | 'urgent'> {
    let status: 'ok' | 'warning' | 'urgent' = 'ok';
    const now = new Date();

    const maintenances = await this.maintenanceRepo.find({
      where: { vehicle: { id: vehicle.id } },
    });

    for (const m of maintenances) {
      if (typeof m.expectedMileage === 'number') {
        const diffKm = m.expectedMileage - vehicle.mileage;

        if (diffKm <= 0) return 'urgent';
        if (diffKm <= 500 && status === 'ok') status = 'warning';
      }

      if (m.expectedDate) {
        const diffDays =
          (new Date(m.expectedDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays <= 0) return 'urgent';
        if (diffDays <= 30 && status === 'ok') status = 'warning';
      }
    }

    return status;
  }
}