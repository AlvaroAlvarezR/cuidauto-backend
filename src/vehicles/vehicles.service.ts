import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UsersService } from '../users/users.service';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private repo: Repository<Vehicle>,
    @InjectRepository(Maintenance) private maintenanceRepo: Repository<Maintenance>,
    private usersService: UsersService
  ) { }

  async create(dto: CreateVehicleDto, userId: number) {
    const vehicle = this.repo.create({
      ...dto,
      user: { id: userId } as any,
    });

    return this.repo.save(vehicle);
  }

  async update(id: number, dto: UpdateVehicleDto, userId: number) {
    const vehicle = await this.repo.findOne({ where: { id, user: { id: userId } } });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado o no autorizado');
    }

    const updated = this.repo.merge(vehicle, dto);
    return this.repo.save(updated);
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