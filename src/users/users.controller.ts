import {
  Controller,
  Get,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Datos del usuario', type: User })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}