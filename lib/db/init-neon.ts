import { db } from './index';
import { restaurants, users, categories, menuItems, tables } from './schema';
import bcrypt from 'bcryptjs';

export async function initializeNeonDatabase() {
  console.log('🗄️  Initializing Neon PostgreSQL database...');

  try {
    // Check if we already have data
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    
    if (existingRestaurants.length > 0) {
      console.log('✅ Database already initialized');
      return;
    }

    // Create sample data
    const restaurantId = 'restaurant-1';
    const userId = 'user-1';

    // Insert restaurant
    await db.insert(restaurants).values({
      id: restaurantId,
      name: 'Burger Palace',
      slug: 'burger-palace',
      description: 'The best burgers in town',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@burgerpalace.com',
      theme: JSON.stringify({
        primaryColor: '#ef4444',
        secondaryColor: '#0ea5e9',
        fontFamily: 'Inter',
      }),
      isActive: true,
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      id: userId,
      email: 'admin@burgerpalace.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      restaurantId: restaurantId,
      isActive: true,
    });

    // Create categories
    const burgerCategoryId = 'category-1';
    const pizzaCategoryId = 'category-2';
    const chickenCategoryId = 'category-3';

    await db.insert(categories).values([
      {
        id: burgerCategoryId,
        name: 'Burgers',
        description: 'Juicy burgers made fresh',
        restaurantId: restaurantId,
        sortOrder: 1,
        isActive: true,
      },
      {
        id: pizzaCategoryId,
        name: 'Pizza',
        description: 'Wood-fired pizzas',
        restaurantId: restaurantId,
        sortOrder: 2,
        isActive: true,
      },
      {
        id: chickenCategoryId,
        name: 'Fried Chicken',
        description: 'Crispy fried chicken',
        restaurantId: restaurantId,
        sortOrder: 3,
        isActive: true,
      },
    ]);

    // Create sample menu items
    await db.insert(menuItems).values([
      {
        id: 'item-1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, onion, and our special sauce',
        price: 12.99,
        category: 'burger',
        categoryId: burgerCategoryId,
        restaurantId: restaurantId,
        isAvailable: true,
        isPopular: true,
        customizations: JSON.stringify([
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
        sortOrder: 1,
      },
      {
        id: 'item-2',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: 16.99,
        category: 'pizza',
        categoryId: pizzaCategoryId,
        restaurantId: restaurantId,
        isAvailable: true,
        isPopular: false,
        sortOrder: 2,
      },
      {
        id: 'item-3',
        name: 'Crispy Fried Chicken',
        description: 'Southern-style fried chicken with secret spices',
        price: 14.99,
        category: 'fried_chicken',
        categoryId: chickenCategoryId,
        restaurantId: restaurantId,
        isAvailable: true,
        isPopular: true,
        sortOrder: 3,
      },
    ]);

    // Create sample tables
    await db.insert(tables).values([
      {
        id: 'table-1',
        number: '1',
        qrCode: 'https://your-app-name.vercel.app/menu/burger-palace/1',
        restaurantId: restaurantId,
        isActive: true,
      },
      {
        id: 'table-2',
        number: '2',
        qrCode: 'https://your-app-name.vercel.app/menu/burger-palace/2',
        restaurantId: restaurantId,
        isActive: true,
      },
      {
        id: 'table-3',
        number: '3',
        qrCode: 'https://your-app-name.vercel.app/menu/burger-palace/3',
        restaurantId: restaurantId,
        isActive: true,
      },
    ]);

    console.log('✅ Neon database initialized successfully!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('Email: admin@burgerpalace.com');
    console.log('Password: admin123');
    console.log('');
    console.log('🌐 Your application is ready!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
