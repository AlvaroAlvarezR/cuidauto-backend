import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico del usuario' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Contraseña del usuario' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
    @IsString()
    firstname: string;
    
    @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
    @IsString()
    lastname: string;
}