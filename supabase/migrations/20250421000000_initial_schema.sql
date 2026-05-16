-- Federation of Earth Database Schema
-- Initial migration for direct democracy platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('member', 'moderator', 'representative', 'admin');
CREATE TYPE community_tier AS ENUM ('local', 'regional', 'global');
CREATE TYPE proposal_status AS ENUM ('draft', 'collecting_signatures', 'active', 'voting', 'closed', 'archived');
CREATE TYPE proposal_type AS ENUM ('standard', 'popular_initiative', 'mandatory_referendum', 'facultative_referendum');
CREATE TYPE vote_type AS ENUM ('yes_no', 'multiple_choice');
CREATE TYPE referendum_type AS ENUM ('mandatory', 'facultative');
CREATE TYPE referendum_status AS ENUM ('pending', 'active', 'passed', 'failed');
CREATE TYPE election_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE comment_vote_type AS ENUM ('upvote', 'downvote');

-- =============================================
-- USERS TABLE (extends auth.users)
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- COMMUNITIES TABLE
-- =============================================
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  tier community_tier NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by all" ON communities
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create communities" ON communities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- COMMUNITY MEMBERS TABLE
-- =============================================
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view community membership" ON community_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join communities" ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" ON community_members
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PROPOSALS TABLE
-- =============================================
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_type proposal_type NOT NULL DEFAULT 'standard',
  status proposal_status NOT NULL DEFAULT 'draft',
  vote_type vote_type NOT NULL DEFAULT 'yes_no',
  signature_count INTEGER NOT NULL DEFAULT 0,
  signature_threshold INTEGER NOT NULL DEFAULT 0,
  campaign_end_date TIMESTAMPTZ,
  voting_start_date TIMESTAMPTZ,
  voting_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Proposals are viewable by all" ON proposals
  FOR SELECT USING (true);

CREATE POLICY "Community members can create proposals" ON proposals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid() AND community_id = proposals.community_id
    )
  );

CREATE POLICY "Authors can update their proposals" ON proposals
  FOR UPDATE USING (auth.uid() = author_id);

-- =============================================
-- PROPOSAL SIGNATURES TABLE
-- =============================================
CREATE TABLE proposal_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

ALTER TABLE proposal_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signatures are viewable by all" ON proposal_signatures
  FOR SELECT USING (true);

CREATE POLICY "Community members can sign proposals" ON proposal_signatures
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals p
      JOIN community_members cm ON p.community_id = cm.community_id
      WHERE p.id = proposal_id AND cm.user_id = auth.uid()
    )
  );

-- =============================================
-- VOTES TABLE
-- =============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_value TEXT NOT NULL,
  cast_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Votes are anonymous - only aggregated results visible
CREATE POLICY "Users can view own votes" ON votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Community members can cast votes" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals p
      JOIN community_members cm ON p.community_id = cm.community_id
      WHERE p.id = proposal_id AND cm.user_id = auth.uid()
    )
  );

-- =============================================
-- VOTE OPTIONS TABLE (for multiple choice)
-- =============================================
CREATE TABLE vote_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vote options are viewable by all" ON vote_options
  FOR SELECT USING (true);

-- =============================================
-- REFERENDUMS TABLE
-- =============================================
CREATE TABLE referendums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  referendum_type referendum_type NOT NULL,
  representative_decision_id UUID,
  trigger_count INTEGER NOT NULL DEFAULT 0,
  trigger_threshold INTEGER NOT NULL,
  status referendum_status NOT NULL DEFAULT 'pending',
  voting_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE referendums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referendums are viewable by all" ON referendums
  FOR SELECT USING (true);

-- =============================================
-- ELECTIONS TABLE
-- =============================================
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status election_status NOT NULL DEFAULT 'upcoming',
  voting_start_date TIMESTAMPTZ NOT NULL,
  voting_end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Elections are viewable by all" ON elections
  FOR SELECT USING (true);

-- =============================================
-- ELECTION CANDIDATES TABLE
-- =============================================
CREATE TABLE election_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statement TEXT,
  vote_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(election_id, user_id)
);

ALTER TABLE election_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are viewable by all" ON election_candidates
  FOR SELECT USING (true);

-- =============================================
-- COMMENTS TABLE (threaded discussions)
-- =============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by all" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- COMMENT VOTES TABLE
-- =============================================
CREATE TABLE comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type comment_vote_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comment votes are viewable by all" ON comment_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on comments" ON comment_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs viewable by admins and for one's own actions
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_proposals_community ON proposals(community_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_author ON proposals(author_id);
CREATE INDEX idx_votes_proposal ON votes(proposal_id);
CREATE INDEX idx_comments_proposal ON comments(proposal_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_member_count_trigger
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Update proposal signature count
CREATE OR REPLACE FUNCTION update_proposal_signature_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE proposals SET signature_count = signature_count + 1 WHERE id = NEW.proposal_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE proposals SET signature_count = signature_count - 1 WHERE id = OLD.proposal_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proposal_signature_count_trigger
AFTER INSERT OR DELETE ON proposal_signatures
FOR EACH ROW EXECUTE FUNCTION update_proposal_signature_count();

-- Update vote option counts
CREATE OR REPLACE FUNCTION update_vote_option_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE vote_options SET vote_count = vote_count + 1
    WHERE proposal_id = NEW.proposal_id AND option_text = NEW.vote_value;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_option_count_trigger
AFTER INSERT ON votes
FOR EACH ROW EXECUTE FUNCTION update_vote_option_count();

-- Update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.vote_type = 'upvote') THEN
      UPDATE comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.vote_type = 'upvote') THEN
      UPDATE comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.vote_type = 'upvote') THEN
      UPDATE comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
    IF (NEW.vote_type = 'upvote') THEN
      UPDATE comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_vote_counts_trigger
AFTER INSERT OR DELETE OR UPDATE ON comment_votes
FOR EACH ROW EXECUTE FUNCTION update_comment_vote_counts();

-- Create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
