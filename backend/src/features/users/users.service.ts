import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../../common/auth/role.enum';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  list() {
    return this.users.find({ order: { createdAt: 'ASC' } });
  }

  async get(id: string) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('Сотрудник не найден');
    return user;
  }

  /** Для входа: вместе с хешем пароля. */
  findWithPassword(email: string) {
    return this.users.findOne({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    if (await this.users.existsBy({ email })) throw new ConflictException('Такой email уже есть');
    const user = this.users.create({ name: dto.name, email, role: dto.role, passwordHash: await bcrypt.hash(dto.password, 10) });
    const { passwordHash: _, ...saved } = await this.users.save(user);
    return saved;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    const user = await this.get(id);
    // админ не может случайно снять с себя права и остаться без доступа к сотрудникам
    if (id === actorId && dto.role && dto.role !== Role.Admin) throw new BadRequestException('Нельзя снять с себя роль администратора');
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      if (await this.users.existsBy({ email: dto.email.toLowerCase() })) throw new ConflictException('Такой email уже есть');
      user.email = dto.email.toLowerCase();
    }
    if (dto.name) user.name = dto.name;
    if (dto.role) user.role = dto.role;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    const { passwordHash: _, ...saved } = await this.users.save(user);
    return saved;
  }

  async remove(id: string, actorId: string) {
    if (id === actorId) throw new BadRequestException('Нельзя удалить самого себя');
    await this.users.remove(await this.get(id));
  }
}
