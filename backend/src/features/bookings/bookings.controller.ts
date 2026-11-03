import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public, Roles } from '../../common/auth/decorators';
import { Role } from '../../common/auth/role.enum';
import { BookingStatus } from './booking.entity';
import { CreateBookingDto, UpdateBookingStatusDto } from './bookings.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Брони')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  /** Заявка с сайта */
  @Public()
  @Post()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.create(dto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager)
  @Get()
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  list(@Query('status', new ParseEnumPipe(BookingStatus, { optional: true })) status?: BookingStatus) {
    return this.bookings.list(status);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager)
  @Get('new-count')
  async newCount() {
    return { count: await this.bookings.countNew() };
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager)
  @Patch(':id/status')
  setStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookingStatusDto) {
    return this.bookings.setStatus(id, dto.status);
  }
}
