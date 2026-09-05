# Quick Start Guide - Mike Carney Wellbeing Hub

This guide will get you up and running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A code editor (VS Code recommended)
- Git installed

## Step 1: Install Dependencies (2 minutes)

```bash
pnpm install
```

> **Note**: You may see warnings about deprecated packages and moderate vulnerabilities in development dependencies (esbuild/drizzle-kit). These are safe to ignore as they only affect local development tools, not production builds. See "Common Issues" section below for details.

## Step 2: Environment Setup (3 minutes)

Create a `.env.local` file in the root directory with these essential variables:

```env
# Minimum required for local development

# Auth Secret (generate one)
AUTH_SECRET="your-secret-here"  # Run: openssl rand -base64 32

# Database (use local or Vercel Postgres)
POSTGRES_URL="postgresql://user:password@localhost:5432/wellbeing"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (optional for local dev - use Azure AD instead)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

### Quick Environment Setup Options:

**Option A: Use Vercel Postgres (Recommended)**
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Pull env vars: `vercel env pull .env.local`

**Option B: Use Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database: `createdb wellbeing`
3. Update `POSTGRES_URL` in `.env.local`

## Step 3: Initialize Database (2 minutes)

```bash
# Push schema to database
pnpm run db:push

# (Optional) Open database studio to view
pnpm run db:studio
```

## Step 4: Run Development Server (1 minute)

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Create First Admin User (2 minutes)

1. **Sign in** with any email from an allowed domain (or modify `auth.config.ts` to allow your test email)

2. **Open Drizzle Studio** in another terminal:
   ```bash
   pnpm run db:studio
   ```

3. **Navigate to** http://localhost:4983

4. **Find the users table** → Find your user → Change `role` to `admin`

5. **Refresh your browser** - you now have admin access!

## Testing Authentication

### Local Development Options:

1. **Email OTP** (requires SMTP setup):
   - Enter your email
   - Check inbox for magic link
   - Click to sign in

2. **Azure AD** (requires Azure setup):
   - See DEPLOYMENT.md for Azure configuration
   - Use Microsoft 365 account

3. **Temporary Bypass** (development only):
   - Temporarily remove domain check in `auth.config.ts`
   - Allow any email for testing
   - **Remember to restore for production!**

## Quick Navigation

After signing in, explore:

- **Dashboard** (`/dashboard`) - Staff home
- **Admin Panel** (`/admin`) - Content management (admin/editor only)
- **News** (`/news`) - Company news
- **Events** (`/events`) - Staff events
- **Policies** (`/policies`) - Company policies
- **Submissions** (`/submissions`) - Share stories/ideas
- **Search** (`/search`) - Global search

## Adding Sample Content

### Via Drizzle Studio:
1. Run `pnpm run db:studio`
2. Manually add records to tables

### Via Seed Script:
1. Copy `lib/db/seed.example.ts` to `lib/db/seed.ts`
2. Install tsx: `npm i -D tsx`
3. Run: `pnpm exec tsx lib/db/seed.ts`

### Via Admin Panel:
1. Sign in as admin
2. Go to `/admin`
3. Use the forms to create content

## Common Issues & Solutions

### "npm audit shows vulnerabilities"
- **Status**: Safe to ignore
- **Reason**: Vulnerabilities are in development-only dependencies (drizzle-kit → esbuild)
- **Impact**: Only affects local dev server, NOT production on Vercel
- **Action**: No action needed - continue with development
- **Future**: Will be resolved when drizzle-kit updates their dependencies

### "Database connection error"
- Check `POSTGRES_URL` is correct
- Ensure PostgreSQL is running
- Try: `pnpm run db:push` again

### "Authentication error"
- Verify `AUTH_SECRET` is set
- Check email domain is in allowed list
- For local dev, use Azure AD or modify domain check

### "Build errors"
- Run: `pnpm run lint` to check for errors
- Ensure all environment variables are set
- Check TypeScript errors: `pnpm exec tsc --noEmit`

### "Can't access admin panel"
- Ensure your user role is 'admin' or 'editor'
- Check database with Drizzle Studio
- Sign out and sign in again

## Development Workflow

```bash
# Start development server
pnpm run dev

# Check for errors
pnpm run lint

# View database
pnpm run db:studio

# Build for production (test)
pnpm run build

# Run production build locally
pnpm run start
```

## File Upload Setup (For Downloads/Policies)

For local development, you can:

1. **Use Vercel Blob** (recommended):
   - Set `BLOB_READ_WRITE_TOKEN` in `.env.local`
   - Files upload to Vercel Blob storage

2. **Mock for now**:
   - Comment out file upload features
   - Add placeholder URLs in database

## Next Steps

1. ✅ Application running locally
2. ✅ Admin user created
3. ✅ Sample content added
4. 📖 Read `README.md` for full documentation
5. 🚀 Ready to deploy? See `DEPLOYMENT.md`
6. 🎨 Customize branding and content
7. 👥 Invite team members

## Quick Commands Reference

```bash
# Development
pnpm run dev              # Start dev server
pnpm run build           # Build for production
pnpm run start           # Run production build
pnpm run lint            # Check for errors

# Database
pnpm run db:push         # Push schema changes
pnpm run db:studio       # Open database GUI

# Deployment
vercel                  # Deploy to Vercel
vercel env pull         # Pull environment variables
```

## Getting Help

- 📖 **Full Documentation**: `README.md`
- 🚀 **Deployment Guide**: `DEPLOYMENT.md`
- ✨ **Features List**: `FEATURES.md`
- 📋 **Development Rules**: `.cursorrules`
- 📊 **Project Overview**: `PROJECT_SUMMARY.md`

## Default Test Credentials

For local development, you can modify `auth.config.ts` to allow test domains:

```typescript
const ALLOWED_DOMAINS = [
  // ... existing domains
  'test.com',  // Add for local testing
];
```

## Success Indicators

You'll know everything is working when:

- ✅ App loads at http://localhost:3000
- ✅ You can sign in
- ✅ Dashboard displays after login
- ✅ Admin panel accessible (if admin)
- ✅ No console errors
- ✅ Navigation works smoothly

---

🎉 **You're ready to start developing!**

*For production deployment, see `DEPLOYMENT.md`*
