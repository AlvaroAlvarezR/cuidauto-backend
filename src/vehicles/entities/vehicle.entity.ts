import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Maintenance } from '../../maintenances/entities/maintenance.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    licensePlate: string;

    @Column()
    mileage: number;

    @ManyToOne(() => User, (user) => user.vehicles)
    user: User;

    @OneToMany(() => Maintenance, (m) => m.vehicle)
    maintenances: Maintenance[];
}