import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './common/auth/auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { typeOrmOptions } from './database/typeorm.options';
import { AuthModule } from './features/auth/auth.module';
import { BookingsModule } from './features/bookings/bookings.module';
import { MenuModule } from './features/menu/menu.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    // .env ищется в папке запуска и рядом с package.json (если сервер запущен из другой папки)
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', join(__dirname, '..', '.env')] }),
    TypeOrmModule.forRoot(typeOrmOptions()),
    // защита публичных форм от спама: не больше 60 запросов в минуту с одного IP
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    AuthModule,
    UsersModule,
    MenuModule,
    BookingsModule,
  ],
  providers: [
    // порядок важен: сначала лимит, потом токен, потом роль
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
