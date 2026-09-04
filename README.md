# Mike Carney Wellbeing Hub

A modern, WCAG-compliant staff wellbeing hub and information resource for Mike Carney Group, built with Next.js and hosted on Vercel.

## Features

- 🔐 **Secure Authentication**: Microsoft 365 (Azure AD) and email OTP login with domain restrictions
- 🏢 **Public & Private Sections**: Public health initiatives and careers pages, plus protected staff resources
- 📰 **Content Management**: News articles, announcements, policies, and events
- 💪 **Mike Carney Health**: Dedicated section for gym and fitness information
- 📥 **Downloads**: PDF forms and policy documents with Vercel Blob storage
- 💡 **Staff Submissions**: Story and idea submission system with moderation
- 🔍 **Global Search**: Search across news, policies, and events
- 👥 **Role-Based Access**: Staff, Editor, and Admin roles with appropriate permissions
- ✨ **Admin CMS**: Easy-to-use admin panel for content management
- ♿ **Accessible**: WCAG 2.2 AA compliant with semantic HTML, keyboard navigation, and focus states

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js (Azure AD & Email providers)
- **Database**: Vercel Postgres with Drizzle ORM
- **File Storage**: Vercel Blob
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A Vercel account
- Azure AD application (for Microsoft 365 login)
- Email SMTP server (for email OTP)

### Installation

1. **Clone the repository**

      ```bash
      git clone <your-repo-url>
      cd MikeCarneyHealth
      ```

2. **Install dependencies**

      ```bash
      pnpm install
      # or
      ppnpm install
      # or
      yarn install
      ```

3. **Set up environment variables**

      Create a `.env.local` file in the root directory:

      ```env
      # Database (Vercel Postgres)
      POSTGRES_URL="your-postgres-url"
      POSTGRES_PRISMA_URL="your-prisma-url"
      POSTGRES_URL_NON_POOLING="your-non-pooling-url"
      POSTGRES_USER="your-user"
      POSTGRES_HOST="your-host"
      POSTGRES_PASSWORD="your-password"
      POSTGRES_DATABASE="your-database"

      # Auth (NextAuth.js)
      AUTH_SECRET="generate-with: openssl rand -base64 32"
      AUTH_TRUST_HOST=true

      # Azure AD (Microsoft 365)
      AUTH_AZURE_AD_ID="your-azure-client-id"
      AUTH_AZURE_AD_SECRET="your-azure-client-secret"
      AUTH_AZURE_AD_TENANT_ID="common" # or your specific tenant

      # Email (OTP)
      EMAIL_SERVER_HOST="smtp.gmail.com"
      EMAIL_SERVER_PORT="587"
      EMAIL_SERVER_USER="your-email@gmail.com"
      EMAIL_SERVER_PASSWORD="your-app-password"
      EMAIL_FROM="noreply@mikecarney.com.au"

      # Vercel Blob Storage
      BLOB_READ_WRITE_TOKEN="your-blob-token"

      # App URL
      NEXT_PUBLIC_APP_URL="http://localhost:3000"
      ```

4. **Set up the database**

      ```bash
      # Push database schema
      pnpm run db:push

      # Optional: Open Drizzle Studio to view/edit database
      pnpm run db:studio
      ```

5. **Run the development server**

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel
```

### 2. Set up Vercel Postgres

1. Go to your project in Vercel Dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Environment variables will be automatically added

### 3. Set up Vercel Blob

1. In Storage tab, create a Vercel Blob store
2. Copy the `BLOB_READ_WRITE_TOKEN` to your environment variables

### 4. Configure Environment Variables

Add all environment variables from your `.env.local` to Vercel:
- Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development

### 5. Set up Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory → App registrations
3. Create a new registration:
   - Name: "Mike Carney Wellbeing Hub"
   - Redirect URI: `https://your-domain.vercel.app/api/auth/callback/azure-ad`
4. Copy the Application (client) ID to `AUTH_AZURE_AD_ID`
5. Create a client secret and copy to `AUTH_AZURE_AD_SECRET`
6. Under API permissions, add:
   - Microsoft Graph → Delegated → openid, profile, email, User.Read

### 6. Deploy

```bash
vercel --prod
```

## Usage

### User Roles

- **Staff**: Can view all protected content, submit stories/ideas
- **Editor**: Staff permissions + can manage content and moderate submissions
- **Admin**: Full access including user management

### First Admin Setup

After initial deployment:
1. Sign in with an authorized email
2. Connect to your database (using Drizzle Studio or direct SQL)
3. Update the first user's role to 'admin':

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@domain.com.au';
```

### Authorized Email Domains

The following domains are allowed for staff login:
- @lexusoftownsville.com.au
- @mikecarneytoyota.com.au
- @inghamtoyota.com.au
- @charterstowerstoyota.com.au
- @mikecarneymahindra.com.au
- @4wdc.com.au

To modify allowed domains, edit `auth.config.ts`.

## Content Management

### Creating Content

Editors and Admins can create content via the Admin Panel (`/admin`):

- **Announcements**: Quick updates for staff
- **News Articles**: Longer form company news
- **Events**: Staff events with dates and locations
- **Policies**: Upload and categorize policy documents
- **Downloads**: Provide forms and resources for download

### Moderating Submissions

1. Go to `/admin/submissions`
2. Review pending submissions
3. Approve or reject with optional feedback note

## Accessibility

This application follows WCAG 2.2 AA standards:

- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Sufficient color contrast
- ✅ ARIA labels where needed
- ✅ Screen reader friendly
- ✅ Skip to main content link

## Project Structure

```
├── app/                        # Next.js App Router pages
│   ├── (auth)/                # Authentication pages
│   ├── admin/                 # Admin panel pages
│   ├── api/                   # API routes
│   └── ...                    # Public and protected pages
├── components/                # React components
│   ├── auth/                  # Authentication components
│   ├── admin/                 # Admin components
│   └── layout/                # Layout components
├── lib/                       # Utility libraries
│   ├── db/                    # Database configuration
│   ├── auth/                  # Auth utilities
│   └── utils/                 # Helper functions
├── types/                     # TypeScript type definitions
├── public/                    # Static assets
└── ...config files
```

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run db:push` - Push database schema changes
- `pnpm run db:studio` - Open Drizzle Studio

## Support

For issues or questions:
- Contact the development team
- Review the `.cursorrules` file for development guidelines

## License

Proprietary - Mike Carney Group

---

Built with ❤️ for Mike Carney Group staff wellbeing