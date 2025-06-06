import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { MaintenanceType } from '../../common/enums/maintenance-type.enum';

export class CreateMaintenanceDto {
    @ApiProperty({ enum: MaintenanceType })
    @IsEnum(MaintenanceType)
    type: MaintenanceType;

    @ApiProperty({ example: '2024-06-01' })
    @IsDateString()
    date: string;

    @ApiProperty({ example: 50000 })
    @IsInt()
    @Min(0)
    mileage: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    expectedMileage?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    expectedDate?: string;
}