# Deployment Guide: Vercel + PostgreSQL

Your code is ready for deployment! Follow these steps to deploy your app to Vercel.

## Prerequisites
- GitHub account (free)
- Vercel account (free) - sign up at https://vercel.com
- Neon account for PostgreSQL database (free) - https://neon.tech

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "parent-invite-app")
3. **Do NOT** initialize with README (we already have one)
4. Click "Create repository"
5. Copy the commands shown under "push an existing repository" and run them:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/parent-invite-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up PostgreSQL Database (Neon)

1. Go to https://console.neon.tech
2. Sign in with GitHub
3. Create a new project:
   - Name: "parent-invite-app"
   - Region: Choose closest to you
   - PostgreSQL version: 15 or higher
4. Once created, click "Connection Details"
5. **Copy the connection string** (it starts with `postgresql://...`)
6. Keep this tab open - you'll need it later!

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Import your repository:
   - Click "Import" next to your "parent-invite-app" repo
4. Configure your deployment:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: ./
5. Add Environment Variables (click "Environment Variables"):
   - `DATABASE_URL`: Paste the Neon connection string from Step 2
   - `JWT_SECRET`: Generate a random string (use https://generate-secret.vercel.app/32 or create your own)
6. Click "Deploy"

## Step 4: Run Database Migrations

After deployment completes, you need to set up the database:

### Option A: Using Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Click on the "Settings" tab
3. Click "Functions" in the sidebar
4. Scroll to "Command Override" and add:
   ```bash
   npx prisma migrate deploy && npx prisma db seed
   ```
5. Redeploy the app

### Option B: Using Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Link your project:
   ```bash
   vercel link
   ```
4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```
5. Run migrations locally against production DB:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Step 5: Test Your Deployment

1. Visit your Vercel deployment URL (shown in Vercel dashboard)
2. Try signing up as a parent
3. Navigate to `/admin` 
4. Login with:
   - Username: `admin`
   - Password: `password`
5. Create some time slots
6. Test parent signup flow

## Troubleshooting

### "Prisma Client not generated"
- Ensure you have a build script in package.json that runs `prisma generate`
- Check Vercel build logs for errors

### Database connection errors
- Verify `DATABASE_URL` in Vercel environment variables
- Ensure Neon database is active
- Check that connection string includes `?sslmode=require`

### Admin credentials not working
- Make sure you ran `npx prisma db seed`
- Check Vercel function logs for errors

## Next Steps

**Security Reminder:** Change the default admin password after deployment!

To change the admin password:
1. Update the seed file with a new password
2. Run: `npx prisma db seed` again
3. Or manually update the password hash in your database

---

**Your app will be live at:** `https://your-project-name.vercel.app`

Any questions? Let me know!
