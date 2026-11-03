import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from '../../common/auth/decorators';
import { Role } from '../../common/auth/role.enum';
import { CreateCategoryDto, CreateDishDto, UpdateCategoryDto, UpdateDishDto } from './menu.dto';
import { MenuService } from './menu.service';

@ApiTags('Меню')
@Controller()
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  /** Меню для гостей сайта */
  @Public()
  @Get('menu')
  publicMenu() {
    return this.menu.publicMenu();
  }
}

@ApiTags('Меню: вкладки')
@ApiBearerAuth()
@Roles(Role.Admin, Role.Manager)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly menu: MenuService) {}

  @Get()
  list() {
    return this.menu.listCategories();
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.menu.createCategory(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.menu.updateCategory(id, dto);
  }

  /** Удаляет вкладку вместе с её блюдами */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menu.removeCategory(id);
  }
}

@ApiTags('Меню: блюда')
@ApiBearerAuth()
@Roles(Role.Admin, Role.Manager)
@Controller('dishes')
export class DishesController {
  constructor(private readonly menu: MenuService) {}

  @Get()
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  list(@Query('categoryId') categoryId?: string) {
    return this.menu.listDishes(categoryId ? Number(categoryId) : undefined);
  }

  @Post()
  create(@Body() dto: CreateDishDto) {
    return this.menu.createDish(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDishDto) {
    return this.menu.updateDish(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menu.removeDish(id);
  }
}
