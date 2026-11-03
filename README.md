# Classic — сайт ресторана с админ-панелью

Full-stack проект: сайт ресторана Classic (Ош), бронь столов и админ-панель для сотрудников с ролями.

| Часть | Стек |
| --- | --- |
| Бэкенд | NestJS 11, TypeORM, PostgreSQL 16, JWT, RBAC, class-validator, Swagger, Throttler |
| Фронтенд | Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4 |
| Инфраструктура | Docker, Docker Compose |

## Что умеет

**Сайт для гостей** (`/`)
- первый экран, «О нас», залы и отель, контакты с картой;
- меню из базы. Блюда с фото разлетаются карточками, собираются в круг, а при прокрутке выстраиваются в арку. Карточка переворачивается и показывает цену. Смена вкладки меняет карточки;
- форма брони. Заявка сохраняется в базе, на неё стоит защита от спама (не больше 5 заявок в минуту с одного IP).

**Админ-панель** (`/admin`)
- вход по email и паролю (JWT);
- **Брони**: новые заявки с счётчиком, подтверждение и отмена, звонок гостю в одно нажатие;
- **Меню**: вкладки и блюда (цена, описание, фото, скрыть или показать);
- **Сотрудники**: добавление, смена роли и пароля, удаление.

**Роли (RBAC)**

| | Брони | Меню | Сотрудники |
| --- | :-: | :-: | :-: |
| `admin` | ✓ | ✓ | ✓ |
| `manager` | ✓ | ✓ | — |

Права проверяются на API (`@Roles()` + `RolesGuard`), а не только скрываются в интерфейсе.

## Структура

```
backend/src
├── common/auth/        AuthGuard (JWT), RolesGuard, @Public(), @Roles(), @CurrentUser()
├── database/           настройки TypeORM, стартовые данные (seed)
└── features/           vertical slices: у каждой фичи свои entity, dto, service, controller
    ├── auth/           POST /auth/login, GET /auth/me
    ├── users/          /users — сотрудники (только admin)
    ├── menu/           GET /menu (публично), /categories, /dishes
    └── bookings/       POST /bookings (публично), список и статусы

frontend/src
├── app/page.tsx        сайт; меню загружается из API внутри <Suspense>
├── app/admin/          вход, брони, меню, сотрудники
├── components/site/    шапка, меню с анимацией, форма брони
├── components/admin/   каркас админки, кнопки и поля
├── config/site.ts      телефоны, адрес, тексты, фото залов
└── lib/                клиент API, сессия сотрудника
```

## Запуск

### Всё в Docker

```bash
docker compose up --build
```

- сайт: http://localhost:3000
- админка: http://localhost:3000/admin
- API и Swagger: http://localhost:4000/api/docs

При первом запуске создаются администратор `admin@classic.local` с паролем `admin12345` и стартовое меню. **Пароль поменяйте сразу** в разделе «Сотрудники».

### Для разработки

```bash
docker compose up -d db          # только PostgreSQL на порту 5440

cd backend
cp .env.example .env
npm install
npm run build && npm run seed    # администратор и меню
npm run start:dev                # http://localhost:4000/api

cd ../frontend
cp .env.example .env.local
npm install
npm run dev                      # http://localhost:3000
```

База из Docker слушает порт **5440**, чтобы не мешать PostgreSQL, установленному на компьютере (5432).

## API

| Метод | Путь | Доступ |
| --- | --- | --- |
| POST | `/api/auth/login` | все (10 попыток в минуту) |
| GET | `/api/auth/me` | сотрудник |
| GET | `/api/menu` | все |
| GET, POST, PATCH, DELETE | `/api/categories`, `/api/dishes` | admin, manager |
| POST | `/api/bookings` | все (5 заявок в минуту) |
| GET | `/api/bookings?status=new` | admin, manager |
| PATCH | `/api/bookings/:id/status` | admin, manager |
| GET, POST, PATCH, DELETE | `/api/users` | admin |

Полное описание с примерами есть в Swagger: `/api/docs`.

## Что можно добавить

- загрузку фото блюд файлом (сейчас фото задаётся ссылкой);
- миграции TypeORM вместо `DB_SYNC=true` для продакшена;
- уведомление в Telegram о новой брони;
- редактирование телефонов и текстов сайта из админки (сейчас они в `frontend/src/config/site.ts`);
- refresh-токены и httpOnly-cookie вместо localStorage.

Фото в примере взяты с Unsplash, цены в меню примерные.
