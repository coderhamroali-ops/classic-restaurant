import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';
import { CategoriesController, DishesController, MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Dish])],
  controllers: [MenuController, CategoriesController, DishesController],
  providers: [MenuService],
})
export class MenuModule {}
