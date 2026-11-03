import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Role } from '../common/auth/role.enum';
import { Category } from '../features/menu/category.entity';
import { Dish } from '../features/menu/dish.entity';
import { User } from '../features/users/user.entity';
import { seedMenu } from './seed-data';

// Заполняет пустую базу: первый администратор и стартовое меню.
// Повторный запуск ничего не дублирует.
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  const db = app.get(DataSource);

  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@classic.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const users = db.getRepository(User);
  if (!(await users.existsBy({ email }))) {
    if (!password) throw new Error('Укажите SEED_ADMIN_PASSWORD в .env');
    await users.save(users.create({ name: 'Администратор', email, role: Role.Admin, passwordHash: await bcrypt.hash(password, 10) }));
    console.log(`Создан администратор ${email}`);
  }

  const categories = db.getRepository(Category);
  if ((await categories.count()) === 0) {
    for (const [i, c] of seedMenu.entries()) {
      const cat = await categories.save(categories.create({ name: c.name, sortOrder: i }));
      await db.getRepository(Dish).save(c.dishes.map((d, j) => ({ ...d, sortOrder: j, categoryId: cat.id })));
    }
    console.log(`Меню: ${seedMenu.length} вкладки, ${seedMenu.reduce((n, c) => n + c.dishes.length, 0)} блюд`);
  }

  await app.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
