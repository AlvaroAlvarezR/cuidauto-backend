import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstname: string;

    @ApiProperty()
    lastname: string;
}