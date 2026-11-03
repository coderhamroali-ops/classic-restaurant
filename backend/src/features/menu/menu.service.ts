import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';
import { CreateCategoryDto, CreateDishDto, UpdateCategoryDto, UpdateDishDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
  ) {}

  /** Меню для сайта: вкладки по порядку, внутри только доступные блюда. */
  async publicMenu() {
    const cats = await this.categories.find({
      relations: { dishes: true },
      order: { sortOrder: 'ASC', id: 'ASC', dishes: { sortOrder: 'ASC', id: 'ASC' } },
    });
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      dishes: c.dishes
        .filter((d) => d.isAvailable)
        .map(({ id, name, price, description, photoUrl }) => ({ id, name, price, description, photoUrl })),
    }));
  }

  // ---------- вкладки ----------
  listCategories() {
    return this.categories.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  createCategory(dto: CreateCategoryDto) {
    return this.categories.save(this.categories.create(dto));
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const cat = await this.categories.findOneBy({ id });
    if (!cat) throw new NotFoundException('Вкладка не найдена');
    return this.categories.save(Object.assign(cat, dto));
  }

  async removeCategory(id: number) {
    const res = await this.categories.delete(id);
    if (!res.affected) throw new NotFoundException('Вкладка не найдена');
  }

  // ---------- блюда ----------
  listDishes(categoryId?: number) {
    return this.dishes.find({
      where: categoryId ? { categoryId } : {},
      order: { categoryId: 'ASC', sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async createDish(dto: CreateDishDto) {
    await this.ensureCategory(dto.categoryId);
    return this.dishes.save(this.dishes.create(dto));
  }

  async updateDish(id: number, dto: UpdateDishDto) {
    const dish = await this.dishes.findOneBy({ id });
    if (!dish) throw new NotFoundException('Блюдо не найдено');
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    return this.dishes.save(Object.assign(dish, dto));
  }

  async removeDish(id: number) {
    const res = await this.dishes.delete(id);
    if (!res.affected) throw new NotFoundException('Блюдо не найдено');
  }

  private async ensureCategory(id: number) {
    if (!(await this.categories.existsBy({ id }))) throw new NotFoundException('Вкладка не найдена');
  }
}
