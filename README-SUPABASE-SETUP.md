# 🗄️ Supabase MCP Server Setup

This guide will help you set up the Supabase Model Context Protocol (MCP) server for Cursor IDE, allowing AI agents to interact directly with your Supabase database.

---

## 🎯 What is Supabase MCP?

The Supabase MCP server allows AI assistants (like Claude in Cursor) to:
- Query your database with natural language
- Understand your schema and relationships
- Help with migrations and schema changes
- Validate database operations

---

## 📋 Prerequisites

1. **Cursor IDE** installed and running
2. **Supabase Account** - Create one at [supabase.com](https://supabase.com)
3. **Supabase Project** - You'll need to create one

---

## 🚀 Setup Steps

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `relaai`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier works for development
5. Wait for project to be created (2-3 minutes)

### Step 2: Get Your Project Reference

1. In your Supabase project dashboard
2. Click **Settings** (gear icon)
3. Click **General**
4. Copy your **Project Reference** (looks like: `abcdefghijklmnop`)
5. Note your **Region** (e.g., `us-east-1`, `eu-west-1`)

### Step 3: Configure MCP in Cursor

The `.cursor/mcp.json` file has already been created for you with basic configuration.

**Basic Setup** (Already Done):
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

**Optional: Add Project-Specific Config**:
If you want to pre-configure your project reference, edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp",
      "env": {
        "SUPABASE_PROJECT_REF": "your-project-ref-here",
        "SUPABASE_REGION": "us-east-1"
      }
    }
  }
}
```

### Step 4: Restart Cursor

1. Close Cursor completely
2. Reopen Cursor
3. Cursor will automatically detect the MCP configuration

### Step 5: Authenticate with Supabase

1. When you first use Supabase MCP commands, Cursor will prompt you
2. A browser window will open asking you to sign in to Supabase
3. Sign in with your Supabase account
4. **Select the organization** containing your `relaai` project
5. Grant permissions to the MCP client
6. Return to Cursor - you should see "Connected to Supabase" message

### Step 6: Run Your Database Schema

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy ALL content from `contracts/database-contracts/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press `Ctrl+Enter`)
7. Wait for execution to complete (should take 30-60 seconds)
8. You should see "Success" message

### Step 7: Verify Database Setup

1. In Supabase dashboard, click **Table Editor**
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `contacts`
   - ✅ `messages`
   - ✅ `relationships`
   - ✅ `personal_facts`
   - ✅ `message_templates`
   - ✅ `important_dates`
   - ✅ `message_analytics`
   - ✅ `user_settings`

---

## 🧪 Test MCP Connection

Now test if the AI can interact with your database:

### Test 1: List Tables
Ask Cursor AI:
```
"Show me all tables in my Supabase database"
```

### Test 2: Query Schema
Ask Cursor AI:
```
"Describe the profiles table structure"
```

### Test 3: Count Rows
Ask Cursor AI:
```
"How many contacts are in the database?"
```

---

## 🔒 Security Best Practices

⚠️ **IMPORTANT**: The MCP server is designed for **development use only**.

### DO:
- ✅ Use separate Supabase projects for dev/staging/prod
- ✅ Enable Row Level Security (RLS) on all tables (already in schema)
- ✅ Start with read-only mode if unsure
- ✅ Use environment variables for sensitive data
- ✅ Regularly rotate API keys

### DON'T:
- ❌ Connect to production databases
- ❌ Share your project reference publicly
- ❌ Commit `.env` files with secrets
- ❌ Disable RLS policies
- ❌ Use service role key in client-side code

---

## 📁 Project Structure

Your database setup is organized in:

```
contracts/database-contracts/
├── schema.sql              # Complete database schema
├── indexes.sql             # Performance indexes (if separated)
└── README.md               # Database documentation
```

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution**:
1. Check internet connection
2. Verify MCP server URL in `.cursor/mcp.json`
3. Restart Cursor
4. Try manual authentication (see below)

### Issue: "Authentication failed"

**Solution**:
1. Clear browser cookies for supabase.com
2. Try incognito/private browser window
3. Re-authenticate through Cursor

### Issue: "Cannot find project"

**Solution**:
1. Verify you selected the correct organization
2. Check project reference is correct
3. Ensure project is fully created (not pending)

### Issue: "Schema errors when running SQL"

**Solution**:
1. Check SQL syntax in schema.sql
2. Verify PostgreSQL version is 15+
3. Try running sections of schema.sql separately
4. Check Supabase logs for specific errors

---

## 📚 Additional Resources

- **Official Docs**: [Supabase MCP Guide](https://supabase.com/docs/guides/getting-started/mcp)
- **Security Guide**: [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

---

## 🎉 Next Steps

After setup is complete:

1. **Define Backend API** - Create Express.js server
2. **Set Up Mobile App** - Initialize React Native
3. **Configure Authentication** - Set up Supabase Auth flows
4. **Create Seed Data** - Add test users and contacts
5. **Write Tests** - Create integration tests for database

---

**Need Help?** Check the project's `CLAUDE.md` for multi-agent development guidelines.

