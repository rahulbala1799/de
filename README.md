# QR Menu Ordering System

A comprehensive digital menu ordering system for restaurants, featuring QR code-based ordering for burgers, pizza, and fried chicken varieties.

## Features

### 🏪 Multi-Tenant Restaurant Management
- Support for multiple restaurants in a single database
- Restaurant-specific branding and themes
- Secure tenant isolation with row-level security

### 📱 Customer-Facing Features
- QR code-based menu access
- Mobile-optimized ordering interface
- Real-time cart management
- Menu item customizations (cooking level, size, etc.)
- Allergen information display

### 🛠️ Admin Dashboard
- Restaurant information management
- Menu item CRUD operations
- Table management with QR code generation
- Order tracking and status updates
- User authentication and role management

### 🍽️ Menu Categories
- **Burgers**: Customizable patties with various toppings
- **Pizza**: Wood-fired pizzas with multiple options
- **Fried Chicken**: Southern-style with sides and combos
- **Sides**: Fries, wings, and other accompaniments
- **Beverages**: Soft drinks, juices, and specialty drinks
- **Desserts**: Sweet treats to end the meal

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel
- **Database Hosting**: Neon
- **Authentication**: NextAuth.js with credentials provider

## Database Architecture

The system uses a **multi-tenant single database** approach with proper tenant isolation:

### Advantages:
- Cost-effective (one Neon database vs multiple)
- Easier maintenance and updates
- Better resource utilization
- Simpler backup/restore processes
- Easier analytics across all restaurants

### Safety Measures:
- Row-level security (RLS) with tenant isolation
- Proper foreign key constraints with tenant scoping
- Database-level validation and constraints
- Regular automated backups
- Staging environment for testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Vercel account for deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-menu-ordering-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/qr_menu_db
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `DATABASE_URL`: Your Neon database connection string
   - `NEXTAUTH_URL`: Your production domain
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXT_PUBLIC_APP_URL`: Your production domain

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Neon Database Setup

1. Create a new Neon project
2. Copy the connection string to your environment variables
3. Run migrations in production:
   ```bash
   npm run db:migrate
   ```

## Usage

### For Restaurant Owners

1. **Sign up/Login** to the admin dashboard
2. **Set up restaurant information** (name, address, branding)
3. **Add menu items** with categories, prices, and customizations
4. **Generate QR codes** for each table
5. **Print and place QR codes** on tables
6. **Monitor orders** in real-time through the dashboard

### For Customers

1. **Scan QR code** on the table
2. **Browse menu** by category
3. **Add items to cart** with customizations
4. **Place order** with contact information
5. **Track order status** (if implemented)

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out

### Restaurant Management
- `GET /api/restaurants` - Get restaurant info
- `PUT /api/restaurants` - Update restaurant info

### Menu Management
- `GET /api/menu` - Get menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/[id]` - Update menu item
- `DELETE /api/menu/[id]` - Delete menu item

### Table Management
- `GET /api/tables` - Get tables
- `POST /api/tables` - Create table
- `PUT /api/tables/[id]` - Update table
- `DELETE /api/tables/[id]` - Delete table

### Order Management
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order status

## Database Schema

### Core Tables
- `restaurants` - Restaurant information and branding
- `users` - Admin users with role-based access
- `categories` - Menu categories
- `menu_items` - Individual menu items with customizations
- `tables` - Restaurant tables with QR codes
- `orders` - Customer orders
- `order_items` - Individual items within orders

### Multi-Tenant Design
All tables include `restaurant_id` for tenant isolation, ensuring data separation between different restaurants.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.

## Roadmap

- [ ] Real-time order notifications
- [ ] Payment integration
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app for restaurant staff
- [ ] Integration with POS systems
