import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /** Цена в сомах, целым числом. */
  @Column({ type: 'int' })
  price: number;

  @Column({ default: '' })
  description: string;

  /** Блюда с фото попадают в анимированную витрину меню. */
  @Column({ type: 'varchar', nullable: true })
  photoUrl: string | null;

  /** Скрытое блюдо не показывается гостям (например, закончилось). */
  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.dishes, { onDelete: 'CASCADE' })
  category: Category;

  @UpdateDateColumn()
  updatedAt: Date;
}
