# Mike Carney Wellbeing Hub

A modern, WCAG 2.2 AA compliant staff wellbeing hub for Mike Carney Group, built with Next.js and Better Auth, hosted on Vercel with Neon Postgres.

## Features

- 🔐 **Secure Authentication**: Better Auth with email magic link and domain restrictions
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

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Authentication**: Better Auth with magic link plugin
- **Database**: Neon Postgres with Drizzle ORM
- **File Storage**: Vercel Blob
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Neon account (for database)
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**

```bash
git clone <your-repo-url>
cd MikeCarneyHealth
npm install
```

2. **Set up environment variables**

Create `.env.local`:

```env
# Auth
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_TRUST_HOST="true"
AUTH_URL="http://localhost:3000"

# Database (Neon Postgres)
POSTGRES_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"
NEON_API_KEY="your-neon-api-key"  # For test branch management

# Email (Mailgun)
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_FROM_EMAIL="noreply@your-domain.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Storage (optional for local dev)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Analytics (optional)
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

3. **Set up test database branch (recommended)**

**Always use a test branch for local development** to keep production safe:

```bash
# Step 1: Get Neon API key
# Visit: https://console.neon.tech/app/settings/api-keys
# Important: Use a Personal API key or Organization API key (not project-scoped)
# Project-scoped keys cannot list all projects and will cause errors

# Step 2: Add to .env.local
NEON_API_KEY="your-api-key-here"

# Step 3: Create test branch
npm run test:branch:create
# This automatically:
# - Creates a 'test-sandbox' branch with production data copy
# - Creates a read/write endpoint
# - Updates .env.local to use the test branch
# - Keeps production database untouched
```

**What Happens**: Creates a new Neon branch called `test-sandbox`, copies all schema and data from production, creates a read/write endpoint, and updates `.env.local` automatically. Production database remains unchanged.

4. **Initialize database**

```bash
# Push schema to database
npm run db:push

# (Optional) Open database studio
npm run db:studio
```

5. **Seed test data (optional)**

```bash
npm run seed:test
```

6. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SECRET` | Secret for session encryption | Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Trust host header | `true` |
| `POSTGRES_URL` | Neon database connection string | `postgresql://...` |
| `MAILGUN_API_KEY` | Mailgun API key for emails | `key-...` |
| `MAILGUN_DOMAIN` | Mailgun domain | `your-domain.com` |
| `MAILGUN_FROM_EMAIL` | Email sender address | `noreply@your-domain.com` |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` |

### Optional

| Variable | Description |
|----------|-------------|
| `NEON_API_KEY` | Neon API key for branch management (Personal or Organization, not project-scoped) |
| `NEON_ORG_ID` | Organization ID (required if using Organization API key) |
| `NEON_PROJECT_ID` | Project ID (skips auto-detection if set) |
| `BRANCH_NAME` | Test branch name (defaults to `test-sandbox`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `AUTH_URL` | Auth callback URL (defaults to `NEXT_PUBLIC_APP_URL`) |

## Authentication Setup

### Email Magic Link (Better Auth)

The app uses Better Auth with Mailgun for email authentication:

1. **Set up Mailgun**
   - Create account at https://www.mailgun.com
   - Verify your domain
   - Get API key from dashboard
   - Add credentials to `.env.local`

2. **Domain Restrictions**

Authorized email domains are configured in `lib/auth/better-auth.ts`:

```typescript
const ALLOWED_DOMAINS = [
  '@lexusoftownsville.com.au',
  '@mikecarneytoyota.com.au',
  // ... add your domains
];
```

### User Roles

- **Staff** (default): Access protected content, submit stories/ideas
- **Editor**: Staff permissions + create/edit content, moderate submissions
- **Admin**: All permissions + user management

### First Admin User

After first login, update user role in database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@domain.com';
```

Or use Drizzle Studio:

```bash
npm run db:studio
# Navigate to users table → update role field
```

## Database Management

### Test Branch Setup

**Always use a test branch for local development** to keep production safe:

```bash
# Create test branch (copies production data)
npm run test:branch:create

# Your .env.local is automatically updated
# Now you can safely test changes

# Delete test branch when done
npm run test:branch:delete

# Use custom branch name
BRANCH_NAME=my-feature-test npm run test:branch:create
```

**Benefits**:
- ✅ Safety: Production database is never touched
- ✅ Isolation: Each developer can have their own branch
- ✅ Fast Setup: Instant copy of production schema and data
- ✅ Easy Cleanup: Delete branch when done

**Troubleshooting "Failed to list projects: 400" Error**:

If you get a 400 error, your API key might be **project-scoped** (cannot list all projects).

**Solution 1** (Recommended): Use a Personal or Organization API key
- Go to https://console.neon.tech/app/settings/api-keys
- Create a new **Personal API key** (not project-scoped)
- Update `NEON_API_KEY` in `.env.local`

**Solution 2**: Manually set project ID
- Find your project ID in Neon dashboard URL: `https://console.neon.tech/app/projects/YOUR-PROJECT-ID`
- Project ID looks like: `cool-forest-86753099` or `hidden-river-50598307` (human-readable name with numbers)
- ⚠️ **NOT** an endpoint ID (endpoint IDs start with `ep-`)
- Add to `.env.local`: `NEON_PROJECT_ID="your-project-id"`
- The script will skip auto-detection and use this ID directly

See [docs/TEST_BRANCH_SETUP.md](./docs/TEST_BRANCH_SETUP.md) for detailed information.

### Schema Changes

```bash
# Update schema in lib/db/schema.ts, then:
npm run db:push

# View database
npm run db:studio
```

### Test Data

```bash
# Seed test data
npm run seed:test

# Clean up test data
npm run test:cleanup
```

## Development

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin CMS
│   ├── api/               # API routes
│   └── ...                # Public and protected pages
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── admin/            # Admin components
│   └── layout/           # Layout components
├── lib/
│   ├── auth/             # Auth configuration (Better Auth)
│   ├── db/               # Database (Drizzle)
│   └── utils/            # Utilities
├── scripts/              # Utility scripts
│   ├── setup-test-branch.ts
│   ├── cleanup-test-data.ts
│   └── ...
└── types/                # TypeScript definitions
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio

# Test Data
npm run seed:test       # Seed test data
npm run test:cleanup    # Clean up test data
npm run test:branch:create   # Create Neon test branch
npm run test:branch:delete   # Delete Neon test branch
```

### Code Quality

- TypeScript strict mode
- ESLint for code quality
- Server Components by default
- Client Components only when needed
- See `.cursorrules` for development standards

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set up Neon Postgres**
   - Vercel Dashboard → Storage → Create Database → Postgres
   - Copy `POSTGRES_URL` to environment variables

4. **Configure Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Set for Production, Preview, and Development

5. **Set up Vercel Blob** (optional)
   - Storage → Create Database → Blob
   - Copy `BLOB_READ_WRITE_TOKEN` to environment variables

6. **Deploy**
   ```bash
   vercel --prod
   ```

7. **Initialize Database**
   ```bash
   # Link project
   vercel link

   # Pull env vars
   vercel env pull .env.local

   # Push schema
   npm run db:push
   ```

### Post-Deployment

- Create first admin user (see "First Admin User" above)
- Configure custom domain (optional)
- Set up monitoring and analytics
- Review security checklist

## Usage

### For Staff

- **Sign in**: Enter email → check inbox for magic link
- **Dashboard**: Personal hub with quick links
- **Content**: Browse news, events, policies, downloads
- **Submit**: Share stories and ideas via submissions
- **Search**: Global search across all content

### For Editors

- **Admin Panel**: Navigate to `/admin`
- **Content Management**: Create announcements, news, events, policies
- **Moderation**: Review and approve staff submissions
- **Downloads**: Upload and manage downloadable resources

### For Admins

- **User Management**: Access `/admin/users` to manage roles
- **System Access**: Full CMS capabilities
- **Configuration**: Database and system settings

## Analytics

The app includes analytics setup:

- **Vercel Analytics**: Automatically enabled on deployment (no config needed)
- **Vercel Speed Insights**: Automatically enabled (no config needed)
- **Google Analytics**: Optional - add `NEXT_PUBLIC_GA_ID` to environment variables

See [docs/TEST_BRANCH_SETUP.md](./docs/TEST_BRANCH_SETUP.md) for analytics configuration details if needed.

## Accessibility

WCAG 2.2 AA compliant with:

- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader friendly (ARIA labels)
- ✅ Focus visible states
- ✅ Sufficient color contrast (4.5:1 minimum)
- ✅ Form labels and error messages
- ✅ Skip to main content link

## Security

- Domain-restricted authentication
- Server-side permission checks
- Secure file uploads (type and size validation)
- Environment variable protection
- HTTPS enforced (Vercel)
- CSRF protection (Better Auth)
- SQL injection prevention (ORM)

## Troubleshooting

### Database Connection

- Verify `POSTGRES_URL` is correct
- Check Neon dashboard for database status
- Ensure connection string includes `?sslmode=require`

### Authentication Issues

- Verify `AUTH_SECRET` is set
- Check email domain is in allowed list (`lib/auth/better-auth.ts`)
- Verify Mailgun credentials are correct
- Check email is being sent (check spam folder)

### Build Errors

```bash
# Check for errors
npm run lint
npm run build

# TypeScript errors
npx tsc --noEmit
```

### Test Branch Issues

- **"org_id is required"** or **Organization ID Required (400)**: 
  - You're using an Organization API key that requires an organization ID
  - Find your Organization ID: https://console.neon.tech/app/settings/organization
  - Look at the URL: `https://console.neon.tech/app/organizations/YOUR-ORG-ID`
  - Add to `.env.local`: `NEON_ORG_ID="your-org-id"`
  - Or use a Personal API key instead (does not require org_id)
- **"Failed to list projects: 400"**: API key is likely project-scoped. Use Personal/Organization API key or set `NEON_PROJECT_ID` manually
- **"user has no access to projects"** or **Access Denied (403)**: 
  - Check if `NEON_PROJECT_ID` starts with `ep-` (that's an endpoint ID, not project ID)
  - Find correct project ID in Neon dashboard URL: `https://console.neon.tech/app/projects/YOUR-PROJECT-ID`
  - Project IDs look like: `cool-forest-86753099` (NOT starting with `ep-`)
  - Remove `NEON_PROJECT_ID` from `.env.local` to let script auto-detect it
- Ensure `NEON_API_KEY` is set in `.env.local`
- Verify API key has correct permissions (Personal or Organization, not project-scoped)
- Check branch exists in Neon dashboard
- Ensure `NEON_API_KEY` is valid and not expired

## Support

### Documentation

- **Quick Test Setup**: [QUICK_TEST_SETUP.md](./QUICK_TEST_SETUP.md)
- **Test Branch Details**: [docs/TEST_BRANCH_SETUP.md](./docs/TEST_BRANCH_SETUP.md)
- **Development Rules**: [.cursorrules](./.cursorrules)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)

## License

Proprietary - Mike Carney Group

---

Built with ❤️ for Mike Carney Group staff wellbeing
