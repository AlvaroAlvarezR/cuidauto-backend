import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, Length } from 'class-validator';

export class UpdateVehicleDto {
    @ApiPropertyOptional({ example: 'Mazda', description: 'Marca del vehículo' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiPropertyOptional({ example: '3', description: 'Modelo del vehículo' })
    @IsOptional()
    @IsString()
    model?: string;

    @ApiPropertyOptional({ example: 2020, description: 'Año del vehículo' })
    @IsOptional()
    @IsInt()
    @Min(1950)
    @Max(new Date().getFullYear() + 1)
    year?: number;

    @ApiPropertyOptional({ example: 'ABC123', description: 'Placa del vehículo' })
    @IsOptional()
    @IsString()
    @Length(5, 10)
    licensePlate?: string;

    @ApiPropertyOptional({ example: 60000, description: 'Kilometraje actual' })
    @IsOptional()
    @IsInt()
    @Min(0)
    mileage?: number;
}