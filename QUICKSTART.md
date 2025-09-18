# Quick Start Guide

## 🚀 Running the Application

### Option 1: Using the startup script
```bash
cd "/Users/rahul/Documents/1 New Apps/de"
./start.sh
```

### Option 2: Manual commands
```bash
cd "/Users/rahul/Documents/1 New Apps/de"
npm run dev
```

The application will start on **http://localhost:3001**

## 🔑 Admin Login Credentials

After the first run, you can login with:
- **Email**: admin@burgerpalace.com
- **Password**: admin123

## 📱 Testing the Application

1. **Admin Dashboard**: http://localhost:3001/admin
2. **Customer Menu**: http://localhost:3001/menu/burger-palace/1
3. **Home Page**: http://localhost:3001

## 🛠️ What's Included

- ✅ Multi-tenant restaurant management
- ✅ QR code menu system
- ✅ Admin dashboard with authentication
- ✅ Menu management (Burgers, Pizza, Fried Chicken)
- ✅ Table management with QR code generation
- ✅ Order tracking system
- ✅ SQLite database (no external setup needed)

## 🎯 Key Features

### For Restaurant Owners:
- Set up restaurant information and branding
- Add/edit menu items with customizations
- Generate QR codes for tables
- Track orders in real-time

### For Customers:
- Scan QR code to access menu
- Browse by categories
- Add items to cart with customizations
- Place orders with contact info

## 🔧 Troubleshooting

If port 3001 is also in use, you can change it:
```bash
PORT=3002 npm run dev
```

Then update the URLs in your browser to use port 3002 instead.
