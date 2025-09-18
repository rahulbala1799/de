import { db } from './index';
import { restaurants, users, categories, menuItems, tables } from './schema';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Create tables (SQLite will create them automatically when we insert data)
    console.log('Initializing database...');

    // Check if we already have data
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    
    if (existingRestaurants.length > 0) {
      console.log('Database already initialized');
      return;
    }

    // Create a sample restaurant
    const [restaurant] = await db.insert(restaurants).values({
      name: 'Burger Palace',
      slug: 'burger-palace',
      description: 'The best burgers in town',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@burgerpalace.com',
      theme: {
        primaryColor: '#ef4444',
        secondaryColor: '#0ea5e9',
        fontFamily: 'Inter',
      },
    }).returning();

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      email: 'admin@burgerpalace.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      restaurantId: restaurant.id,
    });

    // Create categories
    const [burgerCategory] = await db.insert(categories).values({
      name: 'Burgers',
      description: 'Juicy burgers made fresh',
      restaurantId: restaurant.id,
      sortOrder: 1,
    }).returning();

    const [pizzaCategory] = await db.insert(categories).values({
      name: 'Pizza',
      description: 'Wood-fired pizzas',
      restaurantId: restaurant.id,
      sortOrder: 2,
    }).returning();

    const [chickenCategory] = await db.insert(categories).values({
      name: 'Fried Chicken',
      description: 'Crispy fried chicken',
      restaurantId: restaurant.id,
      sortOrder: 3,
    }).returning();

    // Create sample menu items
    await db.insert(menuItems).values([
      {
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, onion, and our special sauce',
        price: 12.99,
        category: 'burger',
        categoryId: burgerCategory.id,
        restaurantId: restaurant.id,
        isAvailable: true,
        isPopular: true,
        customizations: [
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
        ],
        sortOrder: 1,
      },
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: 16.99,
        category: 'pizza',
        categoryId: pizzaCategory.id,
        restaurantId: restaurant.id,
        isAvailable: true,
        isPopular: false,
        sortOrder: 2,
      },
      {
        name: 'Crispy Fried Chicken',
        description: 'Southern-style fried chicken with secret spices',
        price: 14.99,
        category: 'fried_chicken',
        categoryId: chickenCategory.id,
        restaurantId: restaurant.id,
        isAvailable: true,
        isPopular: true,
        sortOrder: 3,
      },
    ]);

    // Create sample tables
    await db.insert(tables).values([
      {
        number: '1',
        qrCode: 'http://localhost:3001/menu/burger-palace/1',
        restaurantId: restaurant.id,
        isActive: true,
      },
      {
        number: '2',
        qrCode: 'http://localhost:3001/menu/burger-palace/2',
        restaurantId: restaurant.id,
        isActive: true,
      },
      {
        number: '3',
        qrCode: 'http://localhost:3001/menu/burger-palace/3',
        restaurantId: restaurant.id,
        isActive: true,
      },
    ]);

    console.log('Database initialized successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@burgerpalace.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
