import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const IS_PUBLIC = 'isPublic';
export const ROLES = 'roles';

/** Маршрут доступен без входа (сайт для гостей). */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Маршрут доступен только этим ролям. Без декоратора — любому вошедшему сотруднику. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);

export interface JwtUser {
  sub: string;
  email: string;
  role: Role;
}

/** Текущий сотрудник из JWT. */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => ctx.switchToHttp().getRequest().user,
);
