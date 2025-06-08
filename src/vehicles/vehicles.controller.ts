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
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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