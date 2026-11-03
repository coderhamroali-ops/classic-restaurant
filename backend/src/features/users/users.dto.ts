import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../common/auth/role.enum';

export class CreateUserDto {
  @IsString() @MinLength(2) @MaxLength(80)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(8) @MaxLength(72)
  password: string;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Новый пароль; не передавайте, чтобы оставить старый' })
  @IsOptional() @IsString() @MinLength(8) @MaxLength(72)
  password?: string;
}
