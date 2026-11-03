import { DataSourceOptions } from 'typeorm';
import { Booking } from '../features/bookings/booking.entity';
import { Category } from '../features/menu/category.entity';
import { Dish } from '../features/menu/dish.entity';
import { User } from '../features/users/user.entity';

export const entities = [User, Category, Dish, Booking];

export function typeOrmOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'classic',
    password: process.env.DB_PASSWORD ?? 'classic',
    database: process.env.DB_NAME ?? 'classic',
    entities,
    synchronize: process.env.DB_SYNC === 'true',
  };
}
