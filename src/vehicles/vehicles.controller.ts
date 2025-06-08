import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('vehicles')
@ApiBearerAuth('access-token') // Requiere autenticación (token)
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'Vehículo creado correctamente' })
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req: any) {
    return this.vehiclesService.create(createVehicleDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vehículo' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del vehículo a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'Vehículo actualizado correctamente',
    schema: {
      example: {
        id: 1,
        brand: 'Mazda',
        model: '3',
        year: 2020,
        licensePlate: 'ABC123',
        mileage: 60000,
        globalStatus: 'ok',
      },
    },
  })
  async updateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
    @Request() req: any,
  ) {
    return this.vehiclesService.update(id, dto, req.user.id);
  }

  // @Get()
  // @ApiOperation({ summary: 'Listar todos los vehículos del usuario autenticado' })
  // findAll(@Request() req: any) {
  //   return this.vehiclesService.findAllByUser(req.user.id);
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vehículos con paginación y estado global' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllPaginated(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Request() req,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Los parámetros de paginación deben ser números');
    }
    return this.vehiclesService.findAllWithStatus(req.user.id, pageNumber, limitNumber);
  }
}