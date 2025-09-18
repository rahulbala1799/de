const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

console.log('🗄️  Initializing database...');

// Create database
const db = new Database('local.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    logo TEXT,
    theme TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'restaurant_owner',
    restaurant_id TEXT,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    restaurant_id TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    category_id TEXT,
    restaurant_id TEXT NOT NULL,
    is_available INTEGER DEFAULT 1,
    is_popular INTEGER DEFAULT 0,
    allergens TEXT,
    nutrition_info TEXT,
    customizations TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  CREATE TABLE IF NOT EXISTS tables (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    qr_code TEXT NOT NULL UNIQUE,
    restaurant_id TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    table_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL,
    notes TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
    FOREIGN KEY (table_id) REFERENCES tables (id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    menu_item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price REAL NOT NULL,
    customizations TEXT,
    notes TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
  );
`);

// Check if we already have data
const existingRestaurants = db.prepare('SELECT COUNT(*) as count FROM restaurants').get();

if (existingRestaurants.count > 0) {
  console.log('✅ Database already initialized');
  db.close();
  process.exit(0);
}

// Create sample data
const restaurantId = 'restaurant-1';
const userId = 'user-1';

// Insert restaurant
db.prepare(`
  INSERT INTO restaurants (id, name, slug, description, address, phone, email, theme)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  restaurantId,
  'Burger Palace',
  'burger-palace',
  'The best burgers in town',
  '123 Main St, City, State 12345',
  '(555) 123-4567',
  'info@burgerpalace.com',
  JSON.stringify({
    primaryColor: '#ef4444',
    secondaryColor: '#0ea5e9',
    fontFamily: 'Inter',
  })
);

// Create admin user
const hashedPassword = bcrypt.hashSync('admin123', 10);
db.prepare(`
  INSERT INTO users (id, email, password, name, role, restaurant_id)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  userId,
  'admin@burgerpalace.com',
  hashedPassword,
  'Admin User',
  'admin',
  restaurantId
);

// Create categories
const burgerCategoryId = 'category-1';
const pizzaCategoryId = 'category-2';
const chickenCategoryId = 'category-3';

db.prepare(`
  INSERT INTO categories (id, name, description, restaurant_id, sort_order)
  VALUES (?, ?, ?, ?, ?)
`).run(burgerCategoryId, 'Burgers', 'Juicy burgers made fresh', restaurantId, 1);

db.prepare(`
  INSERT INTO categories (id, name, description, restaurant_id, sort_order)
  VALUES (?, ?, ?, ?, ?)
`).run(pizzaCategoryId, 'Pizza', 'Wood-fired pizzas', restaurantId, 2);

db.prepare(`
  INSERT INTO categories (id, name, description, restaurant_id, sort_order)
  VALUES (?, ?, ?, ?, ?)
`).run(chickenCategoryId, 'Fried Chicken', 'Crispy fried chicken', restaurantId, 3);

// Create sample menu items
db.prepare(`
  INSERT INTO menu_items (id, name, description, price, category, category_id, restaurant_id, is_available, is_popular, customizations, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'item-1',
  'Classic Burger',
  'Beef patty with lettuce, tomato, onion, and our special sauce',
  12.99,
  'burger',
  burgerCategoryId,
  restaurantId,
  1,
  1,
  JSON.stringify([
    {
      name: 'Cooking Level',
      type: 'single',
      required: true,
      options: [
        { name: 'Medium Rare', price: 0 },
        { name: 'Medium', price: 0 },
        { name: 'Well Done', price: 0 },
      ]
    }
  ]),
  1
);

db.prepare(`
  INSERT INTO menu_items (id, name, description, price, category, category_id, restaurant_id, is_available, is_popular, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'item-2',
  'Margherita Pizza',
  'Fresh mozzarella, tomato sauce, and basil',
  16.99,
  'pizza',
  pizzaCategoryId,
  restaurantId,
  1,
  0,
  2
);

db.prepare(`
  INSERT INTO menu_items (id, name, description, price, category, category_id, restaurant_id, is_available, is_popular, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'item-3',
  'Crispy Fried Chicken',
  'Southern-style fried chicken with secret spices',
  14.99,
  'fried_chicken',
  chickenCategoryId,
  restaurantId,
  1,
  1,
  3
);

// Create sample tables
db.prepare(`
  INSERT INTO tables (id, number, qr_code, restaurant_id)
  VALUES (?, ?, ?, ?)
`).run('table-1', '1', 'http://localhost:3001/menu/burger-palace/1', restaurantId);

db.prepare(`
  INSERT INTO tables (id, number, qr_code, restaurant_id)
  VALUES (?, ?, ?, ?)
`).run('table-2', '2', 'http://localhost:3001/menu/burger-palace/2', restaurantId);

db.prepare(`
  INSERT INTO tables (id, number, qr_code, restaurant_id)
  VALUES (?, ?, ?, ?)
`).run('table-3', '3', 'http://localhost:3001/menu/burger-palace/3', restaurantId);

db.close();

console.log('✅ Database initialized successfully!');
console.log('');
console.log('🔑 Admin Login Credentials:');
console.log('Email: admin@burgerpalace.com');
console.log('Password: admin123');
console.log('');
console.log('🌐 Your application is ready at: http://localhost:3001');
