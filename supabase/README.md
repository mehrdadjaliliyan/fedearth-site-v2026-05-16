# Supabase Database Setup

## Running Migrations

To apply the database schema, follow these steps:

### Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Apply migrations:
```bash
supabase db push
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/20250421000000_initial_schema.sql`
4. Execute the SQL

## Database Schema Overview

### Core Tables

- **users** - User profiles extending auth.users
- **communities** - Governance communities (local/regional/global)
- **community_members** - User memberships in communities
- **proposals** - Democratic proposals and initiatives
- **proposal_signatures** - Support signatures for popular initiatives
- **votes** - Ballot votes (anonymous, one per user per proposal)
- **vote_options** - Multiple choice options for ballots
- **referendums** - Mandatory and facultative referendums
- **elections** - Representative elections
- **election_candidates** - Candidates in elections
- **comments** - Threaded discussions on proposals
- **comment_votes** - Upvotes/downvotes on comments
- **notifications** - User notifications
- **audit_logs** - Immutable audit trail of all actions

### Row Level Security (RLS)

All tables have RLS enabled with policies enforcing:
- **Privacy**: Users can only see their own votes
- **Transparency**: Aggregate results are public
- **RBAC**: Role-based access control for admin/moderator actions
- **Equality**: One vote per user per proposal

### Triggers

Automated triggers maintain data integrity:
- Update member counts in communities
- Update signature counts on proposals
- Update vote counts on options and comments
- Auto-create user profiles on auth signup
- Timestamp updates on record modifications

## Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```
