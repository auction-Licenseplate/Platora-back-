import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LocalLoginDto {
    @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Qwerty1234#' })
    @IsString()
    password: string;
}