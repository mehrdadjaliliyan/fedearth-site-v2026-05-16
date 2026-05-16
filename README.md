# Federation of Earth (fedearth)

**Direct Democracy & Decentralized Governance Platform**

A production-ready web application for transparent, community-driven governance through direct democracy, popular initiatives, referendums, and participatory decision-making.

---

## About

The **Federation of Earth** platform was founded on **November 7, 2025** in **Zug, Switzerland** by **Ali Mizani Oskui** (Chairman) and **Martin Liebi** (Board Member), and registered with the **Handelsregisteramt des Kantons Zug**.

This platform enables communities at local, regional, and global levels to practice direct democracy through:

- **Popular initiatives** with signature collection and time-limited campaigns
- **Direct voting** on proposals with real-time results
- **Mandatory and facultative referendums** with 3-5% citizen trigger thresholds
- **Representative elections** with citizen referendum override power
- **Threaded discussions** with community moderation
- **Full transparency** through immutable audit logs

---

## Features

### Core Functionality

✅ **Authentication & RBAC**
- Supabase Auth with email/password
- Four role levels: member, moderator, representative, admin
- Protected routes and API endpoints

✅ **Communities**
- Three tiers: local, regional, global
- Join/leave functionality
- Community-scoped proposals and voting

✅ **Proposals & Popular Initiatives**
- Create proposals with title, description, type
- Popular initiatives require 5% signature threshold
- Time-limited campaigns (30 days default)
- Status lifecycle: draft → collecting signatures → active → voting → closed

✅ **Voting System**
- Yes/No and multiple-choice ballots
- One vote per user per proposal (enforced)
- Real-time vote count updates via Supabase Realtime
- Transparent results with percentages
- Vote integrity and anti-manipulation checks

✅ **Referendums**
- **Mandatory referendums**: automatically triggered for specific decision types
- **Facultative referendums**: 3-5% of community members can trigger
- Veto/override behavior for representative decisions

✅ **Admin Panel**
- Platform-wide analytics dashboard
- User and community management
- Audit log viewer
- System health monitoring

✅ **Transparency & Rights**
- **Privacy**: Individual votes are anonymous; only aggregates are public
- **Freedom of Expression**: Moderation policy protects legitimate political speech
- **Equality**: One member = one vote, no weighted voting
- Complete audit trail for all actions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS with custom design system |
| **Backend** | Next.js API routes, Supabase |
| **Database** | PostgreSQL (via Supabase) |
| **Authentication** | Supabase Auth (JWT-based sessions) |
| **Real-time** | Supabase Realtime for live vote updates |
| **Deployment** | Vercel, Netlify, or any Node.js host |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Supabase account** (free tier works)
- **Git**

### Installation

1. **Clone the repository**

```bash
cd /app/samples
npm install
```

2. **Set up Supabase**

- Create a new project at [supabase.com](https://supabase.com)
- Go to **SQL Editor** and run the migration:
  - Copy contents of `supabase/migrations/20250421000000_initial_schema.sql`
  - Paste and execute in SQL Editor
- (Optional) Run seed data from `supabase/seed.sql` after creating test users

3. **Configure environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: **Supabase Dashboard → Settings → API**

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
/app/samples/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── auth/                 # Login, register
│   │   ├── dashboard/            # User dashboard
│   │   ├── communities/          # Community pages
│   │   ├── proposals/            # Proposal list, create, detail
│   │   ├── admin/                # Admin panel
│   │   ├── globals.css           # Tailwind + custom styles
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   └── page.tsx              # Landing page
│   ├── components/               # Reusable components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   └── ProtectedRoute.tsx   # RBAC wrapper
│   ├── lib/                      # Utilities and configuration
│   │   ├── auth-context.tsx     # Auth provider
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # Helper functions
│   └── types/                    # TypeScript definitions
│       └── index.ts              # All type definitions
├── supabase/
│   ├── migrations/               # Database schema
│   ├── seed.sql                  # Sample data
│   └── README.md                 # Database docs
├── assets/                       # User-provided files
│   ├── specification.txt         # Full platform spec
│   └── Protocol-incorporation... # Founding protocol
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md                     # This file
```

---

## Usage Guide

### For Members

1. **Sign up** at `/auth/register`
2. **Browse communities** at `/communities`
3. **Join a community** to participate
4. **Vote on proposals** or **create your own**
5. **Sign popular initiatives** to help them reach voting stage
6. **Participate in discussions**

### For Moderators

- Review flagged content
- Manage discussions within your community
- Enforce community guidelines

### For Representatives

- Make decisions on behalf of your community
- **Note**: All decisions can be overridden by facultative referendums if 3-5% of members trigger one

### For Admins

- Access **Admin Dashboard** at `/admin`
- Manage users and assign roles
- Create and configure communities
- View audit logs
- Monitor platform analytics

---

## Key Concepts

### Popular Initiatives

1. Member creates a proposal with `popular_initiative` type
2. System calculates 5% signature threshold based on community size
3. 30-day campaign begins
4. If threshold is reached → proposal moves to voting
5. If threshold is not reached → proposal is archived

### Referendums

**Mandatory Referendum**
- Automatically triggered for constitutional changes, major budget decisions
- All community members vote

**Facultative Referendum**
- Triggered when ≥3-5% of members challenge a representative decision
- If vote passes → representative decision is overridden
- If vote fails → decision stands

### Vote Integrity

- One authenticated user = one vote per proposal
- Votes are cryptographically linked to user ID
- Individual votes are private (only user can see their own vote)
- Aggregate results are publicly visible
- All votes are logged in immutable audit trail

---

## Security & Privacy

- **Authentication**: Supabase Auth with JWT sessions
- **Row Level Security**: Enabled on all tables
- **RBAC**: Role-based policies enforced at database level
- **Vote Privacy**: Individual votes not exposed via public API
- **Audit Logging**: All governance actions tracked
- **Input Validation**: Server-side validation on all mutations
- **SQL Injection Protection**: Parameterized queries via Supabase client

---

## Real-time Features

The platform uses **Supabase Realtime** for live updates:

- **Vote counts** update instantly as votes are cast
- **Signature counts** update during popular initiative campaigns
- Subscribe to changes via PostgreSQL `LISTEN/NOTIFY`

Example (already implemented in proposal detail page):

```typescript
const subscription = supabase
  .channel(`proposal-${proposalId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'vote_options',
    filter: `proposal_id=eq.${proposalId}`
  }, () => {
    loadVoteOptions(); // Refresh vote counts
  })
  .subscribe();
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy

---

## Development

### Run type checking

```bash
npm run typecheck
```

### Run linter

```bash
npm run lint
```

### Build for production

```bash
npm run build
npm start
```

---

## Roadmap

Future enhancements:

- [ ] Email notifications for governance events
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Blockchain-based vote verification
- [ ] Representative candidate statements and campaigns
- [ ] Petition system for mandatory referendums
- [ ] Budget allocation voting
- [ ] Community constitution editor

---

## Contributing

This platform is built for the **Federation of Earth** organization. For inquiries or collaboration:

- **Chairman**: Ali Mizani Oskui
- **Board Member**: Martin Liebi
- **Location**: Gubelstrasse 24, 6300 Zug, Switzerland
- **Registry**: Handelsregisteramt des Kantons Zug

---

## License

[Specify license - e.g., MIT, GPL, or proprietary]

---

## Support

For technical support or questions about using the platform, refer to:

- **Database setup**: `supabase/README.md`
- **Environment variables**: `.env.example`
- **Type definitions**: `src/types/index.ts`

---

**Built with ❤️ for direct democracy and transparent governance**

*Founded November 7, 2025 in Zug, Switzerland*
# fedearth-site-v2026-05-16
