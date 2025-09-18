import { pgTable, text, integer, real, boolean, timestamp, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Restaurants table (tenant isolation)
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text('email'),
  logo: text('logo'),
  theme: text('theme'), // JSON string for theme customization
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Users table (admin, restaurant owners, staff)
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().$type<'admin' | 'restaurant_owner' | 'staff'>(),
  restaurantId: text('restaurant_id').references(() => restaurants.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Menu items table
export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image'),
  category: text('category').notNull(), // burger, pizza, fried_chicken, etc.
  categoryId: text('category_id').references(() => categories.id),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  isAvailable: boolean('is_available').default(true),
  isPopular: boolean('is_popular').default(false),
  allergens: text('allergens'), // JSON string
  nutritionInfo: text('nutrition_info'), // JSON string
  customizations: text('customizations'), // JSON string for customization options
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tables table (for QR codes)
export const tables = pgTable('tables', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: text('number').notNull(),
  qrCode: text('qr_code').notNull().unique(),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text('order_number').notNull(),
  tableId: text('table_id').notNull().references(() => tables.id),
  restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  status: text('status').default('pending').$type<'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'>(),
  totalAmount: real('total_amount').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text('order_id').notNull().references(() => orders.id),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: real('unit_price').notNull(),
  customizations: text('customizations'), // JSON string
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
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