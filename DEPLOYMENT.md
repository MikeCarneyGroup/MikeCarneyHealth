# Deployment Guide - Mike Carney Wellbeing Hub

This guide walks you through deploying the Mike Carney Wellbeing Hub to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Azure AD application configured
- Email SMTP credentials

## Step 1: Prepare the Repository

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: `.next`

## Step 3: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose a database name (e.g., `wellbeing-hub-db`)
5. Select a region close to your users
6. Click **Create**

The following environment variables will be automatically added:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 4: Set Up Vercel Blob Storage

1. In the **Storage** tab, click **Create Database**
2. Select **Blob**
3. Choose a name (e.g., `wellbeing-hub-files`)
4. Click **Create**

This will automatically add:
- `BLOB_READ_WRITE_TOKEN`

## Step 5: Configure Azure AD

### Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - Name: `Mike Carney Wellbeing Hub`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: 
     - Type: Web
     - URL: `https://your-app.vercel.app/api/auth/callback/azure-ad`
5. Click **Register**

### Get Application Credentials

1. On the app overview page, copy the **Application (client) ID**
   - This is your `AUTH_AZURE_AD_ID`
2. Copy the **Directory (tenant) ID**
   - This is your `AUTH_AZURE_AD_TENANT_ID`
3. Go to **Certificates & secrets** → **Client secrets**
4. Click **New client secret**
5. Add description and expiry
6. Copy the secret value (only shown once)
   - This is your `AUTH_AZURE_AD_SECRET`

### Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
6. Click **Add permissions**
7. Click **Grant admin consent** (requires admin role)

## Step 6: Add Environment Variables to Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

### Authentication
```
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_TRUST_HOST=true
AUTH_AZURE_AD_ID=<from Azure portal>
AUTH_AZURE_AD_SECRET=<from Azure portal>
AUTH_AZURE_AD_TENANT_ID=<from Azure portal or "common">
```

### Email (for OTP)
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<your-email@gmail.com>
EMAIL_SERVER_PASSWORD=<your-app-password>
EMAIL_FROM=<noreply@yourdomain.com.au>
```

**Note for Gmail**: Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### Application URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Step 7: Deploy

1. Click **Deploy** in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app.vercel.app`

## Step 8: Initialize Database Schema

After first deployment:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link to your project:
```bash
vercel link
```

3. Pull environment variables:
```bash
vercel env pull .env.local
```

4. Push database schema:
```bash
npm run db:push
```

## Step 9: Create First Admin User

1. Visit your deployed app and sign in with an authorized email
2. Connect to your database using Drizzle Studio:
```bash
npm run db:studio
```

3. Or use Vercel Postgres dashboard to run SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@domain.com.au';
```

## Step 10: Update Azure AD Redirect URIs

1. Go back to Azure Portal → Your app registration
2. Under **Authentication**, add all redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/azure-ad`
   - `https://your-app-*.vercel.app/api/auth/callback/azure-ad` (for preview deployments)
   - `http://localhost:3000/api/auth/callback/azure-ad` (for local development)

## Post-Deployment

### Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain (e.g., `wellbeing.mikecarney.com.au`)
3. Configure DNS records as shown
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Azure AD redirect URIs

### Monitoring

- **Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Enable Vercel Analytics in project settings
- **Error Tracking**: Consider adding Sentry or similar

### Backup

Set up regular database backups:
1. Vercel Postgres includes automatic backups
2. For additional safety, set up scheduled exports

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure dependencies are in `package.json`

### Authentication Issues
- Verify Azure AD redirect URIs match exactly
- Check that all auth environment variables are set
- Ensure `AUTH_SECRET` is properly generated
- Verify allowed email domains in `auth.config.ts`

### Database Connection Issues
- Verify Postgres environment variables
- Check that schema was pushed
- Review connection logs in Vercel

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Ensure Gmail App Password is used (not regular password)
- Test SMTP connection separately

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `AUTH_SECRET` is strong and random
- [ ] Azure AD redirect URIs are restricted to your domains
- [ ] Email domains are properly restricted in `auth.config.ts`
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] First admin user is created and secured

## Maintenance

### Updating Environment Variables
1. Go to Vercel project settings
2. Update the variable
3. Redeploy the project

### Database Migrations
1. Update schema in `lib/db/schema.ts`
2. Run `npm run db:push` locally or via Vercel CLI
3. Test thoroughly before deploying

### Dependencies Updates
```bash
npm update
npm run build  # Test locally
git push       # Deploy to Vercel
```

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review application logs in Vercel dashboard

---

Your Mike Carney Wellbeing Hub is now live! 🎉
