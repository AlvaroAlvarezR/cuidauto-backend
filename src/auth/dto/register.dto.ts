import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @IsNotEmpty()
    lastname: string;
}