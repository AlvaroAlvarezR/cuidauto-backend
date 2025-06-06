import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Contraseña' })
    @IsString()
    @MinLength(6)
    password: string;
}