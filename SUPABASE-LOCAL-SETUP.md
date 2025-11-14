# Supabase Local Development Setup

This guide explains how to run Supabase locally using Docker for development.

## Prerequisites

- **Docker Desktop** installed and running
- **Supabase CLI** (optional, for managing migrations)
- **Git** (already configured)

## Installation Options

### Option 1: Using Docker Compose (Recommended)

Supabase provides an official Docker Compose setup that runs all services locally.

#### Step 1: Install Supabase CLI

**On macOS:**
```bash
brew install supabase/tap/supabase
```

**On Linux:**
```bash
# Download the latest binary
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz

# Move to /usr/local/bin (may need sudo)
sudo mv supabase /usr/local/bin/supabase

# Verify installation
supabase --version
```

**On Windows:**
```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Step 2: Start Supabase Locally

```bash
# Navigate to project root
cd /path/to/relaai-project

# Start all Supabase services (PostgreSQL, Auth, Storage, Realtime, etc.)
supabase start
```

This command will:
- Pull required Docker images
- Start PostgreSQL, PostgREST, GoTrue (Auth), Storage, Realtime, and Studio
- Display connection details and credentials

**Example output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGci...
service_role key: eyJhbGci...
```

#### Step 3: Apply Database Migrations

```bash
# Apply all migrations in supabase/migrations/
supabase migration up
```

This will:
- Run `20251114113401_initial_schema.sql`
- Create all tables, indexes, RLS policies, functions, and seed data

#### Step 4: Access Supabase Studio

Open your browser and navigate to:
```
http://localhost:54323
```

Supabase Studio provides a web UI for:
- Viewing and editing tables
- Running SQL queries
- Testing RLS policies
- Managing authentication
- Monitoring real-time subscriptions

### Option 2: Manual Docker Setup (Advanced)

If you prefer not to install the Supabase CLI, you can manually manage Docker containers.

#### Step 1: Clone Supabase Docker Compose

```bash
# Clone the Supabase repository
git clone --depth 1 https://github.com/supabase/supabase

# Navigate to the Docker directory
cd supabase/docker
```

#### Step 2: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your preferences
# Important: Change POSTGRES_PASSWORD and JWT_SECRET
```

#### Step 3: Start Docker Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Step 4: Apply Migrations Manually

```bash
# Connect to PostgreSQL container
docker exec -it supabase-db psql -U postgres

# Run the migration SQL
\i /path/to/relaai-project/supabase/migrations/20251114113401_initial_schema.sql

# Exit psql
\q
```

## Verifying the Setup

### Check Running Services

```bash
# Using Supabase CLI
supabase status

# Or check Docker containers
docker ps
```

You should see containers for:
- `supabase-db` (PostgreSQL)
- `supabase-auth` (GoTrue)
- `supabase-rest` (PostgREST)
- `supabase-realtime`
- `supabase-storage`
- `supabase-studio`
- `supabase-meta`

### Test Database Connection

```bash
# Using psql
psql postgresql://postgres:postgres@localhost:54322/postgres

# List tables
\dt

# You should see:
# - profiles
# - contacts
# - messages
# - relationships
# - personal_facts
# - message_templates
# - important_dates
# - message_analytics
# - user_settings
```

### Test API Connection

```bash
# Get anon key from supabase start output
ANON_KEY="your-anon-key-here"

# Test API
curl http://localhost:54321/rest/v1/ \
  -H "apikey: $ANON_KEY"
```

## Using Supabase Locally

### Environment Variables for Mobile App

Update your mobile app's `.env` file:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
```

### Connection Details

- **API URL:** `http://localhost:54321`
- **Database URL:** `postgresql://postgres:postgres@localhost:54322/postgres`
- **Studio URL:** `http://localhost:54323`
- **Inbucket (Email Testing):** `http://localhost:54324`

### Testing Authentication

1. Open Supabase Studio: `http://localhost:54323`
2. Go to **Authentication** → **Users**
3. Click **Add User** to create a test user
4. Use the test user credentials in your mobile app

## Managing Migrations

### Create a New Migration

```bash
# Create a new migration file
supabase migration new add_new_feature

# Edit the generated file in supabase/migrations/
# File format: YYYYMMDDHHMMSS_add_new_feature.sql
```

### Apply Migrations

```bash
# Apply all pending migrations
supabase migration up

# Apply specific migration
supabase migration up --version 20251114113401
```

### Rollback Migrations

```bash
# Rollback last migration
supabase migration down

# Rollback to specific version
supabase migration down --version 20251114113401
```

### Check Migration Status

```bash
# List all migrations and their status
supabase migration list
```

## Stopping Supabase

### Using Supabase CLI

```bash
# Stop all services but keep data
supabase stop

# Stop and remove all data (fresh start)
supabase stop --no-backup
```

### Using Docker Compose

```bash
# Stop services
docker-compose down

# Stop and remove volumes (data)
docker-compose down -v
```

## Troubleshooting

### Port Conflicts

If ports 54321-54324 are already in use, edit `supabase/config.toml`:

```toml
[api]
port = 54321  # Change to available port

[db]
port = 54322  # Change to available port

[studio]
port = 54323  # Change to available port

[inbucket]
port = 54324  # Change to available port
```

### Docker Memory Issues

Ensure Docker has at least **4GB of RAM** allocated:
- **Docker Desktop:** Preferences → Resources → Memory

### Migration Failures

If migrations fail:

1. Check PostgreSQL logs:
   ```bash
   docker logs supabase-db
   ```

2. Verify migration SQL syntax:
   ```bash
   # Test SQL in psql
   psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/migrations/20251114113401_initial_schema.sql
   ```

3. Reset database and try again:
   ```bash
   supabase db reset
   ```

### Cannot Connect to Database

1. Verify services are running:
   ```bash
   supabase status
   ```

2. Check Docker containers:
   ```bash
   docker ps
   ```

3. Restart services:
   ```bash
   supabase stop
   supabase start
   ```

## Next Steps

After successfully setting up Supabase locally:

1. **Test the Schema:**
   - Open Studio and verify all tables exist
   - Test RLS policies with different users
   - Run SQL queries to test functions

2. **Configure Mobile App:**
   - Update `.env` with local Supabase URL
   - Test authentication flow
   - Test CRUD operations on contacts

3. **Seed Test Data:**
   - Create test users
   - Add sample contacts
   - Generate test messages

4. **Setup Development Workflow:**
   - Use feature branches for schema changes
   - Test migrations locally before pushing
   - Document schema changes in contracts/

## Resources

- **Supabase CLI Docs:** https://supabase.com/docs/guides/cli
- **Local Development Guide:** https://supabase.com/docs/guides/local-development
- **Docker Compose Reference:** https://docs.docker.com/compose/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Note:** This local setup is for development only. For production, use a cloud-hosted Supabase project or follow the deployment guide.
