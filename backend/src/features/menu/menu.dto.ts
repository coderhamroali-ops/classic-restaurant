import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @MinLength(1) @MaxLength(60)
  name: string;

  @IsOptional() @IsInt()
  sortOrder?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CreateDishDto {
  @IsString() @MinLength(1) @MaxLength(100)
  name: string;

  /** Цена в сомах */
  @IsInt() @Min(0)
  price: number;

  @IsOptional() @IsString() @MaxLength(300)
  description?: string;

  /** Ссылка на фото; null — без фото */
  @IsOptional() @ValidateIf((_, v) => v !== null) @IsUrl({ require_protocol: true })
  photoUrl?: string | null;

  @IsOptional() @IsBoolean()
  isAvailable?: boolean;

  @IsOptional() @IsInt()
  sortOrder?: number;

  @IsInt()
  categoryId: number;
}

export class UpdateDishDto extends PartialType(CreateDishDto) {}
