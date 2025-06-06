import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MaintenancesService } from './maintenances.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('maintenances')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('maintenances')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) { }

  @Post(':vehicleId')
  @ApiOperation({ summary: 'Registrar mantenimiento para un vehículo' })
  @ApiResponse({ status: 201, description: 'Mantenimiento creado correctamente' })
  create(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateMaintenanceDto,
    @Request() req: any,
  ) {
    return this.maintenancesService.create(+vehicleId, dto);
  }

  // @Get(':vehicleId')
  // @ApiOperation({ summary: 'Listar mantenimientos de un vehículo' })
  // findByVehicle(@Param('vehicleId') vehicleId: string) {
  //   return this.maintenancesService.findByVehicle(+vehicleId);
  // }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Obtener mantenimientos de un vehículo con paginación' })
  async findByVehicle(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Los parámetros de paginación deben ser números');
    }

    return this.maintenancesService.findByVehicle(vehicleId, pageNumber, limitNumber);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un mantenimiento' })
  remove(@Param('id') id: string) {
    return this.maintenancesService.remove(+id);
  }
}