# CRM Backend

## Что делает backend

Этот backend построен под такой сценарий:

1. Пользователь регистрирует компанию.
2. Получает `company accessToken` и `companyId`.
3. Внутри dashboard компания создаёт сотрудников.
4. Сотрудники входят по `companyId + email + password`.
5. Компания и сотрудники работают с продуктами внутри своей компании.
6. Компания создаёт и редактирует одну публичную `company page`.

## Главная модель данных

- `companies`
  - корневая сущность
  - `employeesCount` теперь считается автоматически по таблице `employees`
- `employees`
  - каждый сотрудник обязательно принадлежит одной компании через `company_id`
- `products`
  - каждый продукт обязательно принадлежит одной компании через `company_id`
  - у продукта есть `createdByEmployeeId` и `updatedByEmployeeId`
- `company_pages`
  - одна company page на одну компанию
  - связь через `company_id`
- `product_images`, `product_attributes`, `product_characteristics`
  - дочерние таблицы продукта

## Важные правила

- Все операции по `employees` и `products` изолированы внутри своей компании.
- Компания не может увидеть сотрудников или продукты другой компании.
- Сотрудник не может работать вне своей компании.
- Для логина сотрудника обязателен `companyId`.
- `company page` доступна публично только по `slug`.

## Права доступа

- `company token`
  - полный доступ к своей компании
  - может управлять компанией, сотрудниками, продуктами и company page
- `employee token` с ролью `admin` или `manager`
  - может управлять сотрудниками своей компании
  - может создавать, обновлять и удалять любые продукты своей компании
- `employee token` с ролью `user`
  - может смотреть сотрудников и продукты своей компании
  - может обновлять только себя через `/api/employees/me`
  - может создавать продукты
  - может менять и удалять только те продукты, которые создал сам
- Публичный доступ
  - только `GET /api/company-pages/slug/:slug`

## Ответы API

- Все успешные JSON-ответы имеют `success: true`
- `DELETE`-эндпоинты возвращают `204 No Content`
- Для защищённых роутов нужен заголовок:

```text
Authorization: Bearer ACCESS_TOKEN
```

## Что фронт должен хранить

- После логина компании:
  - `accessToken`
  - `company.id` как `companyId`
- После логина сотрудника:
  - `accessToken`
  - `employee.companyId`
  - `employee.role`

## Установка

```bash
npm install
```

## Переменные окружения

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=very-strong-secret
JWT_EXPIRES_IN=7d
PORT=3000
```

## SQL и миграции

### Чистая база

```bash
psql "$DATABASE_URL" -f sql/migrations/001_create_companies.sql
psql "$DATABASE_URL" -f sql/migrations/003_create_employees.sql
psql "$DATABASE_URL" -f sql/migrations/004_create_products.sql
psql "$DATABASE_URL" -f sql/migrations/005_create_company_pages.sql
```

### Если база уже была создана до новых привязок

Запусти дополнительную миграцию:

```bash
psql "$DATABASE_URL" -f sql/migrations/006_add_company_ownership_to_employees_and_products.sql
```

Важно:

- если в старой базе уже есть строки в `employees` или `products`, нужно заполнить им `company_id`
- миграция сама поставит `NOT NULL` только если пустых `company_id` не осталось

Пример ручного backfill:

```sql
UPDATE employees
SET company_id = 'company_xxxxxxxxxx'
WHERE company_id IS NULL;

UPDATE products
SET company_id = 'company_xxxxxxxxxx'
WHERE company_id IS NULL;
```

## Запуск

```bash
npm run dev
```

или

```bash
npm start
```

## API для фронта

### 1. Регистрация и логин компании

#### `POST /api/auth/register`

Body:

```json
{
  "name": "Acme Clinic",
  "adminLogin": "acme-admin",
  "password": "StrongPass123"
}
```

Ответ:

```json
{
  "success": true,
  "accessToken": "jwt",
  "company": {
    "id": "company_ab12CD34ef",
    "name": "Acme Clinic",
    "adminLogin": "acme-admin",
    "createdAt": "2026-05-20T12:00:00.000Z",
    "employeesCount": 0
  }
}
```

#### `POST /api/auth/login`

Body:

```json
{
  "adminLogin": "acme-admin",
  "password": "StrongPass123"
}
```

#### `GET /api/auth/me`

Возвращает текущую компанию по `company token`.

#### `PATCH /api/companies/me`

Разрешено менять только название компании.

Body:

```json
{
  "name": "Acme Clinic Group"
}
```

### 2. Сотрудники

Основной CRUD для dashboard: используй именно `/api/employees`.

#### Форма сотрудника

```json
{
  "id": 1,
  "companyId": "company_ab12CD34ef",
  "name": "Jane Doe",
  "avatarUrl": null,
  "email": "jane@acme.com",
  "phone": "+77001234567",
  "role": "manager",
  "startDate": "2026-05-20",
  "createdAt": "2026-05-20T12:00:00.000Z",
  "updatedAt": "2026-05-20T12:00:00.000Z",
  "isWorking": true,
  "age": 28,
  "sex": "female"
}
```

#### `GET /api/employees`

Доступ:

- `company token`
- любой `employee token`

Query:

- `role`
- `isWorking=true|false`
- `search`
- `limit`
- `offset`

#### `POST /api/employees`

Доступ:

- `company token`
- `employee token` с ролью `admin` или `manager`

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "password": "StrongPass123",
  "role": "manager",
  "phone": "+77001234567",
  "startDate": "2026-05-20",
  "avatarUrl": null,
  "isWorking": true,
  "age": 28,
  "sex": "female"
}
```

#### `GET /api/employees/:id`

Вернёт сотрудника только если он принадлежит текущей компании.

#### `PATCH /api/employees/:id`

Доступ:

- `company token`
- `employee token` с ролью `admin` или `manager`

#### `DELETE /api/employees/:id`

Доступ:

- `company token`
- `employee token` с ролью `admin` или `manager`

#### `PATCH /api/employees/me`

Доступ:

- только `employee token`

Сотрудник меняет сам себя.

#### `DELETE /api/employees/me`

Доступ:

- только `employee token`

### 3. Логин сотрудника

#### `POST /api/employee-auth/login`

Body:

```json
{
  "companyId": "company_ab12CD34ef",
  "email": "jane@acme.com",
  "password": "StrongPass123"
}
```

Ответ:

```json
{
  "success": true,
  "accessToken": "jwt",
  "employee": {
    "id": 1,
    "companyId": "company_ab12CD34ef",
    "name": "Jane Doe",
    "email": "jane@acme.com",
    "role": "manager",
    "isWorking": true
  }
}
```

#### `GET /api/employee-auth/me`

Возвращает текущего сотрудника по `employee token`.

#### `POST /api/employee-auth/register`

Это защищённый shortcut-роут.

Доступ:

- `company token`
- `employee token` с ролью `admin` или `manager`

Нормальный dashboard должен создавать сотрудников через `/api/employees`.

### 4. Продукты

#### Форма продукта

```json
{
  "id": "product_abc123def456",
  "companyId": "company_ab12CD34ef",
  "title": "Dental Kit",
  "description": "Starter kit",
  "slug": "dental-kit",
  "currency": "USD",
  "price": 99.99,
  "compareAtPrice": 129.99,
  "sku": "DENTAL-KIT-001",
  "stock": 12,
  "category": "Equipment",
  "status": "active",
  "brand": "Acme",
  "tags": ["clinic", "starter"],
  "weight": "",
  "width": "",
  "height": "",
  "length": "",
  "seoTitle": "",
  "seoDescription": "",
  "discount": 0,
  "orders": 0,
  "rating": 0,
  "revenue": 0,
  "views": 0,
  "createdByEmployeeId": 1,
  "updatedByEmployeeId": 1,
  "images": [],
  "attributes": [],
  "characteristics": [],
  "createdAt": "2026-05-20T12:00:00.000Z",
  "updatedAt": "2026-05-20T12:00:00.000Z"
}
```

#### `GET /api/products`

Доступ:

- `company token`
- любой `employee token`

Query:

- `status`
- `category`
- `brand`
- `currency`
- `search`
- `tag`
- `minPrice`
- `maxPrice`
- `inStock`
- `limit`
- `offset`
- `sortBy`
- `sortOrder`

#### `POST /api/products`

Доступ:

- `company token`
- любой `employee token`

Минимально обязательные поля:

```json
{
  "title": "Dental Kit",
  "slug": "dental-kit",
  "price": 99.99,
  "sku": "DENTAL-KIT-001",
  "category": "Equipment"
}
```

Поддерживаются также:

- `description`
- `currency`
- `compareAtPrice`
- `stock`
- `status`
- `brand`
- `tags`
- `weight`, `width`, `height`, `length`
- `seoTitle`, `seoDescription`
- `discount`, `orders`, `rating`, `revenue`, `views`
- `images`
- `attributes`
- `characteristics`

#### `GET /api/products/:id`

Возвращает продукт только текущей компании.

#### `GET /api/products/slug/:slug`

Возвращает продукт только текущей компании.

#### `PATCH /api/products/:id`

Доступ:

- `company token` может менять любой продукт своей компании
- `employee token` с ролью `admin` или `manager` может менять любой продукт своей компании
- `employee token` с ролью `user` может менять только свой продукт

#### `DELETE /api/products/:id`

Права такие же, как у `PATCH /api/products/:id`.

### 5. Company Page

Одна компания = одна company page.

#### `POST /api/company-pages`

Доступ:

- только `company token`

Если `status = "published"`, то `slug` обязателен.

Пример body:

```json
{
  "slug": "acme-clinic",
  "status": "draft",
  "name": "Acme Clinic",
  "category": "Dental Clinic",
  "city": "Almaty",
  "country": "Kazakhstan",
  "address": "123 Central Avenue",
  "email": "hello@acmeclinic.com",
  "phone": "+77001234567",
  "website": "acmeclinic.com",
  "workingHours": "Mon-Fri 09:00-18:00",
  "shortDescription": "Family dental clinic",
  "fullDescription": "Full company presentation for the landing page.",
  "aboutTitle": "About us",
  "aboutText": "We have served patients for more than 10 years.",
  "brandColor": "#1f4e79",
  "ctaLabel": "Book now",
  "ctaNote": "Same day appointments available",
  "logo": null,
  "coverImage": null,
  "galleryImages": [],
  "services": [],
  "advantages": [],
  "faqItems": [],
  "socialLinks": [],
  "blocks": [
    "hero",
    "about",
    "services",
    "gallery",
    "advantages",
    "faq",
    "contacts"
  ],
  "settings": {}
}
```

#### `GET /api/company-pages/me`

Возвращает company page текущей компании.

#### `PATCH /api/company-pages/me`

Обновляет company page текущей компании.

#### `DELETE /api/company-pages/me`

Удаляет company page текущей компании.

#### `GET /api/company-pages/slug/:slug`

Публичный роут без токена.

Возвращает только опубликованную страницу.

## Что должен делать фронт

- После регистрации компании сохранять `company accessToken` и `company.id`
- В форме логина сотрудника обязательно спрашивать `companyId`
- Для owner dashboard использовать `company token`
- Для employee dashboard использовать `employee token`
- CRUD сотрудников строить через `/api/employees`
- CRUD продуктов строить через `/api/products`
- Конструктор company page строить через `/api/company-pages/me`
