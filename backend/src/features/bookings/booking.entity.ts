import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingStatus {
  New = 'new',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  date: string;

  /** ЧЧ:ММ */
  @Column({ length: 5 })
  time: string;

  @Column({ type: 'int' })
  guests: number;

  @Column({ default: 'Ужин' })
  occasion: string;

  @Column({ default: '' })
  comment: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.New })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;
}
