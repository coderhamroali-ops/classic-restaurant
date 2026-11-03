import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
import { BookingStatus } from './booking.entity';

export class CreateBookingDto {
  @IsString() @MinLength(2) @MaxLength(80)
  name: string;

  @IsString() @Matches(/^\+?[\d\s()-]{7,20}$/, { message: 'Проверьте номер телефона' })
  phone: string;

  /** ГГГГ-ММ-ДД */
  @IsDateString({ strict: true })
  date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Время в формате ЧЧ:ММ' })
  time: string;

  @IsInt() @Min(1) @Max(500)
  guests: number;

  @IsOptional() @IsString() @MaxLength(60)
  occasion?: string;

  @IsOptional() @IsString() @MaxLength(500)
  comment?: string;
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
