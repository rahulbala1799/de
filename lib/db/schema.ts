import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Restaurants table (tenant isolation)
export const restaurants = sqliteTable('restaurants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text('email'),
  logo: text('logo'),
  theme: text('theme', { mode: 'json' }).$type<{
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  }>(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Users table (with restaurant association)
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'restaurant_owner', 'staff'] }).notNull().default('restaurant_owner'),
  restaurantId: text('restaurant_id').references(() => restaurants.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Menu categories
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Menu items
export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image'),
  category: text('category', { enum: ['burger', 'pizza', 'fried_chicken', 'beverage', 'side', 'dessert'] }).notNull(),
  categoryId: text('category_id').references(() => categories.id),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
  allergens: text('allergens', { mode: 'json' }).$type<string[]>(),
  nutritionInfo: text('nutrition_info', { mode: 'json' }).$type<{
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }>(),
  customizations: text('customizations', { mode: 'json' }).$type<{
    name: string;
    type: 'single' | 'multiple';
    required: boolean;
    options: {
      name: string;
      price: number;
    }[];
  }[]>(),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tables (for QR code generation)
export const tables = sqliteTable('tables', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: text('number').notNull(),
  qrCode: text('qr_code').notNull().unique(),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Orders
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text('order_number').notNull(),
  tableId: text('table_id').notNull().references(() => tables.id),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  status: text('status', { enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'] }).default('pending'),
  totalAmount: real('total_amount').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Order items
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text('order_id').notNull().references(() => orders.id),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: real('unit_price').notNull(),
  customizations: text('customizations', { mode: 'json' }).$type<{
    name: string;
    options: string[];
  }[]>(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Relations
export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  users: many(users),
  categories: many(categories),
  menuItems: many(menuItems),
  tables: many(tables),
  orders: many(orders),
}));

export const usersRelations = relations(users, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [users.restaurantId],
    references: [restaurants.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [categories.restaurantId],
    references: [restaurants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const tablesRelations = relations(tables, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));