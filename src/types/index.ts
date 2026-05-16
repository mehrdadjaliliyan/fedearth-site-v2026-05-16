export type UserRole = 'member' | 'moderator' | 'representative' | 'admin';

export type CommunityTier = 'local' | 'regional' | 'global';

export type ProposalStatus = 'draft' | 'collecting_signatures' | 'active' | 'voting' | 'closed' | 'archived';

export type ProposalType = 'standard' | 'popular_initiative' | 'mandatory_referendum' | 'facultative_referendum';

export type VoteType = 'yes_no' | 'multiple_choice';

export type ReferendumType = 'mandatory' | 'facultative';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  tier: CommunityTier;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  role: UserRole;
  joined_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  community_id: string;
  author_id: string;
  proposal_type: ProposalType;
  status: ProposalStatus;
  vote_type: VoteType;
  signature_count: number;
  signature_threshold: number;
  campaign_end_date?: string;
  voting_start_date?: string;
  voting_end_date?: string;
  created_at: string;
  updated_at: string;
  community?: Community;
  author?: User;
}

export interface ProposalSignature {
  id: string;
  proposal_id: string;
  user_id: string;
  signed_at: string;
}

export interface Vote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote_value: string;
  cast_at: string;
}

export interface VoteOption {
  id: string;
  proposal_id: string;
  option_text: string;
  vote_count: number;
  display_order: number;
}

export interface Referendum {
  id: string;
  proposal_id: string;
  referendum_type: ReferendumType;
  representative_decision_id?: string;
  trigger_count: number;
  trigger_threshold: number;
  status: 'pending' | 'active' | 'passed' | 'failed';
  created_at: string;
  voting_end_date?: string;
}

export interface Election {
  id: string;
  community_id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  voting_start_date: string;
  voting_end_date: string;
  created_at: string;
}

export interface ElectionCandidate {
  id: string;
  election_id: string;
  user_id: string;
  statement: string;
  vote_count: number;
  user?: User;
}

export interface Comment {
  id: string;
  proposal_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
}

export interface CommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  created_at: string;
  user?: User;
}
