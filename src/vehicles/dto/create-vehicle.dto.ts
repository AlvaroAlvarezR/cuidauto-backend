import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, Length } from 'class-validator';

export class CreateVehicleDto {
    @ApiProperty({ example: 'Mazda', description: 'Marca del vehículo' })
    @IsString()
    brand: string;

    @ApiProperty({ example: '3', description: 'Modelo del vehículo' })
    @IsString()
    model: string;

    @ApiProperty({ example: 2020, description: 'Año del vehículo' })
    @IsInt()
    @Min(1950)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @ApiProperty({ example: 'ABC123', description: 'Placa del vehículo' })
    @IsString()
    @Length(5, 10)
    licensePlate: string; // 👈 igual que en la entidad

    @ApiProperty({ example: 60000, description: 'Kilometraje actual' })
    @IsInt()
    @Min(0)
    mileage: number;
}