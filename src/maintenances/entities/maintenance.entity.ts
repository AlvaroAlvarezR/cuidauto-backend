import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { MaintenanceType } from '../../common/enums/maintenance-type.enum';

@Entity()
export class Maintenance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: 'oil' | 'brakes' | 'tires' | 'battery' | 'belt' | 'cooling';

    @Column()
    date: Date;

    @Column()
    mileage: number;

    @Column({ nullable: true })
    description?: string;

    // Nuevos campos para cálculos de recordatorios
    @Column({ type: 'int', nullable: true })
    expectedMileage?: number;

    @Column({ type: 'date', nullable: true })
    expectedDate?: Date;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenances)
    vehicle: Vehicle;
}