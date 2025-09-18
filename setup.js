const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up QR Menu Ordering System...');

// Create .env.local file
const envContent = `# Database (using SQLite for local development)
DATABASE_URL=file:./local.db

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created');
} catch (error) {
  console.log('⚠️  Could not create .env.local file (may already exist)');
}

// Initialize database
console.log('🗄️  Initializing database...');

const { initializeDatabase } = require('./lib/db/init.ts');

async function setup() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    console.log('');
    console.log('🎉 Setup complete!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('Email: admin@burgerpalace.com');
    console.log('Password: admin123');
    console.log('');
    console.log('🌐 Your application is ready at: http://localhost:3001');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

setup();
