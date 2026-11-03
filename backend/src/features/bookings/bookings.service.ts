import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './bookings.dto';

@Injectable()
export class BookingsService {
  constructor(@InjectRepository(Booking) private readonly bookings: Repository<Booking>) {}

  create(dto: CreateBookingDto) {
    const today = new Date().toISOString().slice(0, 10);
    if (dto.date < today) throw new BadRequestException('Дата брони уже прошла');
    return this.bookings.save(this.bookings.create({ ...dto, status: BookingStatus.New }));
  }

  /** Новые сверху; можно отфильтровать по статусу. */
  list(status?: BookingStatus) {
    return this.bookings.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async setStatus(id: number, status: BookingStatus) {
    const booking = await this.bookings.findOneBy({ id });
    if (!booking) throw new NotFoundException('Бронь не найдена');
    booking.status = status;
    return this.bookings.save(booking);
  }

  /** Число новых заявок — для значка в админке. */
  countNew() {
    return this.bookings.countBy({ status: BookingStatus.New });
  }
}
