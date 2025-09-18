# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Neon Database**: Sign up at [neon.tech](https://neon.tech) for PostgreSQL
3. **GitHub Repository**: Your code should be pushed to GitHub

## Step 1: Set up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy your connection string (it looks like: `postgresql://username:password@hostname/database?sslmode=require`)
3. Keep this connection string handy for the next step

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = your-secret-key-here-make-it-long-and-random
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
DATABASE_URL = your-neon-postgresql-connection-string
```

**Important Notes:**
- Replace `your-app-name.vercel.app` with your actual Vercel app URL
- For `NEXTAUTH_SECRET`, generate a random string (you can use: `openssl rand -base64 32`)
- The `DATABASE_URL` is your Neon PostgreSQL connection string

## Step 4: Initialize Database

After your app is deployed:

1. Go to your deployed app URL
2. Visit: `https://your-app-name.vercel.app/api/init-db?secret=init-db-secret-2024`
3. This will create all the necessary tables and sample data

## Step 5: Test Your Application

1. **Home Page**: `https://your-app-name.vercel.app`
2. **Admin Login**: `https://your-app-name.vercel.app/admin`
   - Email: `admin@burgerpalace.com`
   - Password: `admin123`
3. **Customer Menu**: `https://your-app-name.vercel.app/menu/burger-palace/1`

## Troubleshooting

### Environment Variables Error
If you see "Environment Variable references Secret which does not exist":
- Make sure all environment variables are set in Vercel dashboard
- Redeploy your application after adding environment variables

### Database Connection Error
- Verify your `DATABASE_URL` is correct
- Make sure your Neon database is active
- Check that the database initialization API was called

### Build Errors
- Make sure all dependencies are in `package.json`
- Check that your code doesn't have TypeScript errors
- Verify all imports are correct

## Production Considerations

1. **Security**: Change the database initialization secret
2. **Admin Password**: Change the default admin password
3. **Domain**: Set up a custom domain if needed
4. **Monitoring**: Set up error tracking and monitoring
5. **Backups**: Set up regular database backups

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Neon database logs
3. Verify all environment variables are set correctly
4. Make sure the database initialization was successful
