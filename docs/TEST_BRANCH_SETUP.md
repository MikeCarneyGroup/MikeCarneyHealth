# Neon Test Branch Setup Guide

This guide explains how to create and use a Neon database branch for local testing, keeping your production database safe.

## Quick Start

### 1. Get Your Neon API Key

1. Go to [Neon Console - API Keys](https://console.neon.tech/app/settings/api-keys)
2. Click "Create API Key"
3. **Important**: Select **Personal API key** or **Organization API key** (not project-scoped)
   - Project-scoped keys cannot list all projects and will cause a 400 error
4. Give it a name (e.g., "Local Development")
5. Copy the API key (you won't see it again!)

### 2. Add API Key to .env.local

Add this line to your `.env.local` file:

```bash
NEON_API_KEY="your-api-key-here"
```

### 3. Create Test Branch

Run the setup script:

```bash
npm run test:branch:create
```

This will:
- ✅ Automatically find your Neon project
- ✅ Create a new branch called `test-sandbox`
- ✅ Copy all schema and data from production
- ✅ Create a read/write endpoint
- ✅ Update `.env.local` to use the test branch

### 4. Sync Schema to Test Branch

After creating the branch, sync your schema:

```bash
npm run db:push
```

### 5. Seed Test Data (Optional)

Add test data to your branch:

```bash
npm run seed:test
```

## What Gets Created

- **Branch Name**: `test-sandbox` (configurable via `BRANCH_NAME` env var)
- **Data**: Full copy of production schema and data
- **Endpoint**: Read/write endpoint for the test branch
- **Connection**: Automatically updated in `.env.local`

## Environment Variables

The script uses these environment variables (from `.env.local`):

- `NEON_API_KEY` - **Required**: Your Neon API key (Personal or Organization, not project-scoped)
- `NEON_PROJECT_ID` - Optional: Project ID (skips auto-detection if set)
- `BRANCH_NAME` - Optional: Branch name (defaults to `test-sandbox`)
- `POSTGRES_URL` - Used to extract connection details

## Custom Branch Name

To use a different branch name:

```bash
BRANCH_NAME=my-feature-test npm run test:branch:create
```

## Switching Back to Production

If you need to switch back to production, edit `.env.local` and restore the original `POSTGRES_URL`. The script saves the original URL as a comment:

```bash
# Original production URL (backup):
# POSTGRES_URL="postgresql://..."

# Test branch: test-sandbox (br-xxx)
POSTGRES_URL="postgresql://..."
```

## Deleting the Test Branch

When you're done testing:

```bash
npm run test:branch:delete
```

This will:
- ✅ Find and delete the `test-sandbox` branch
- ✅ Clean up all associated endpoints
- ⚠️ **Warning**: This cannot be undone!

## Benefits of Using Test Branches

1. **Safety**: Production database is never touched
2. **Isolation**: Each developer can have their own branch
3. **Fast Setup**: Instant copy of production schema and data
4. **Easy Cleanup**: Delete branch when done
5. **No Conflicts**: Multiple developers can test simultaneously

## Troubleshooting

### "NEON_API_KEY is required"

Add your API key to `.env.local`:
```bash
NEON_API_KEY="your-key-here"
```

### "Branch already exists"

The branch name is already in use. Either:
- Delete the existing branch: `npm run test:branch:delete`
- Use a different name: `BRANCH_NAME=my-test npm run test:branch:create`

### "Failed to list projects: 400" Error

**Cause**: Your API key is likely **project-scoped** and cannot list all projects.

**Solutions**:

1. **Use a Personal or Organization API key** (recommended):
   - Go to https://console.neon.tech/app/settings/api-keys
   - Create a new **Personal API key** (not project-scoped)
   - Update `NEON_API_KEY` in `.env.local`

2. **Manually set project ID** (workaround):
   - Find your project ID in the Neon dashboard URL (e.g., `https://console.neon.tech/app/projects/your-project-id`)
   - Or extract from connection string
   - Add to `.env.local`: `NEON_PROJECT_ID="your-project-id"`
   - The script will skip auto-detection and use this ID directly

### "Could not find project"

The script tries to auto-detect your project. If it fails:
1. Get your project ID from the Neon dashboard URL
2. Add to `.env.local`: `NEON_PROJECT_ID="your-project-id"`

### Connection Timeout

Neon branches may take a few seconds to initialize. Wait 10-30 seconds and try again.

## Best Practices

1. **Always use test branches** for local development
2. **Delete branches** when you're done to save resources
3. **Use descriptive names** for feature-specific branches
4. **Keep API keys secure** - never commit them to git
5. **Sync schema** after creating branch: `npm run db:push`

## Advanced: Multiple Test Branches

You can create multiple branches for different purposes:

```bash
# Feature branch
BRANCH_NAME=feature-auth-migration npm run test:branch:create

# Bug fix branch
BRANCH_NAME=bugfix-login-issue npm run test:branch:create
```

Each branch is completely isolated and can be deleted independently.

## Integration with CI/CD

For CI/CD, you can create temporary branches:

```bash
# In CI/CD pipeline
BRANCH_NAME=ci-test-${GITHUB_RUN_ID} npm run test:branch:create
# ... run tests ...
npm run test:branch:delete
```

## Cost Considerations

- Neon branches are **free** for development/testing
- Branches auto-pause after inactivity (like main database)
- Delete branches when not in use to free up resources
- Each branch has its own compute endpoint (minimal cost when active)
