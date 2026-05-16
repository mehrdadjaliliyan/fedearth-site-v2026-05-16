'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Proposal, VoteOption, Comment } from '@/types';
import { Clock, Users, CheckCircle, XCircle, TrendingUp, MessageCircle, PenTool } from 'lucide-react';
import { formatDate, formatRelativeTime, calculatePercentage, daysUntil } from '@/lib/utils';

export default function ProposalDetailPage() {
  return (
    <ProtectedRoute>
      <ProposalDetailContent />
    </ProtectedRoute>
  );
}

function ProposalDetailContent() {
  const params = useParams();
  const { user } = useAuth();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (proposalId && user) {
      loadProposalData();
    }
  }, [proposalId, user]);

  // Real-time vote updates
  useEffect(() => {
    if (!proposalId) return;

    const subscription = supabase
      .channel(`proposal-${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vote_options',
          filter: `proposal_id=eq.${proposalId}`,
        },
        () => {
          loadVoteOptions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [proposalId]);

  async function loadProposalData() {
    try {
      setLoading(true);

      // Load proposal
      const { data: proposalData, error: proposalError } = await supabase
        .from('proposals')
        .select('*, communities(*), users(*)')
        .eq('id', proposalId)
        .single();

      if (proposalError) throw proposalError;
      setProposal(proposalData as any);

      // Load vote options
      await loadVoteOptions();

      // Check if user has voted
      const { data: voteData } = await supabase
        .from('votes')
        .select('vote_value')
        .eq('proposal_id', proposalId)
        .eq('user_id', user?.id)
        .maybeSingle();

      setUserVote(voteData?.vote_value || null);

      // Check if user has signed
      const { data: signatureData } = await supabase
        .from('proposal_signatures')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', user?.id)
        .maybeSingle();

      setUserSignature(!!signatureData);

      // Load comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, users(*)')
        .eq('proposal_id', proposalId)
        .is('parent_id', null)
        .order('upvotes', { ascending: false });

      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading proposal:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVoteOptions() {
    const { data } = await supabase
      .from('vote_options')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('display_order');

    setVoteOptions(data || []);
  }

  async function handleVote(optionText: string) {
    if (!user || userVote) return;

    try {
      setVoting(true);

      const { error } = await supabase.from('votes').insert({
        proposal_id: proposalId,
        user_id: user.id,
        vote_value: optionText,
      });

      if (error) throw error;

      setUserVote(optionText);

      // Create audit log
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'cast_vote',
        entity_type: 'proposal',
        entity_id: proposalId,
        details: { vote: optionText },
      });

      await loadVoteOptions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVoting(false);
    }
  }

  async function handleSign() {
    if (!user || userSignature) return;

    try {
      setSigning(true);

      const { error } = await supabase.from('proposal_signatures').insert({
        proposal_id: proposalId,
        user_id: user.id,
      });

      if (error) throw error;

      setUserSignature(true);

      // Reload proposal to update signature count
      await loadProposalData();

      // Create audit log
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'sign_proposal',
        entity_type: 'proposal',
        entity_id: proposalId,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSigning(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="card animate-pulse">
            <div className="h-8 bg-surface-elevated rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-surface-elevated rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-elevated rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="card text-center py-12">
            <p className="text-text-secondary">Proposal not found</p>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = voteOptions.reduce((sum, opt) => sum + opt.vote_count, 0);
  const isVotingActive = proposal.status === 'voting';
  const isCollectingSignatures = proposal.status === 'collecting_signatures';
  const hasReachedThreshold = proposal.signature_count >= proposal.signature_threshold;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Proposal Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-emphasis mb-3">{proposal.title}</h1>
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                <span>{proposal.community?.name}</span>
                <span>•</span>
                <span>by {proposal.author?.full_name}</span>
                <span>•</span>
                <span>{formatDate(proposal.created_at)}</span>
              </div>
            </div>
            <span
              className={`badge text-sm ${
                proposal.status === 'voting'
                  ? 'badge-success'
                  : proposal.status === 'active' || proposal.status === 'collecting_signatures'
                  ? 'badge-primary'
                  : 'badge-error'
              }`}
            >
              {proposal.status.replace('_', ' ')}
            </span>
          </div>

          <p className="text-text-primary leading-relaxed mb-6 whitespace-pre-wrap">
            {proposal.description}
          </p>

          {/* Proposal Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background rounded-lg">
            <div>
              <div className="text-xs text-text-secondary mb-1">Type</div>
              <div className="text-sm font-medium text-text-emphasis">
                {proposal.proposal_type.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-secondary mb-1">Vote Type</div>
              <div className="text-sm font-medium text-text-emphasis">
                {proposal.vote_type === 'yes_no' ? 'Yes / No' : 'Multiple Choice'}
              </div>
            </div>
            {isCollectingSignatures && (
              <div>
                <div className="text-xs text-text-secondary mb-1">Signatures</div>
                <div className="text-sm font-medium text-text-emphasis">
                  {proposal.signature_count} / {proposal.signature_threshold}
                </div>
              </div>
            )}
            {proposal.campaign_end_date && isCollectingSignatures && (
              <div>
                <div className="text-xs text-text-secondary mb-1">Days Left</div>
                <div className="text-sm font-medium text-text-emphasis">
                  {daysUntil(proposal.campaign_end_date)} days
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature Collection */}
        {isCollectingSignatures && (
          <div className="card mb-8">
            <div className="flex items-center gap-3 mb-4">
              <PenTool className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-text-emphasis">Signature Collection</h3>
            </div>
            <p className="text-text-secondary mb-4">
              This popular initiative needs {proposal.signature_threshold} signatures to proceed to voting.
              {proposal.campaign_end_date && ` Campaign ends in ${daysUntil(proposal.campaign_end_date)} days.`}
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Progress</span>
                <span className="font-semibold text-text-emphasis">
                  {calculatePercentage(proposal.signature_count, proposal.signature_threshold)}%
                </span>
              </div>
              <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      calculatePercentage(proposal.signature_count, proposal.signature_threshold),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            {!userSignature ? (
              <button onClick={handleSign} disabled={signing} className="btn btn-primary">
                {signing ? 'Signing...' : 'Sign This Initiative'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sky-300">
                <CheckCircle className="w-5 h-5" />
                <span>You have signed this initiative</span>
              </div>
            )}
          </div>
        )}

        {/* Voting Section */}
        {isVotingActive && (
          <div className="card mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-text-emphasis">Cast Your Vote</h3>
            </div>

            {userVote ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sky-300 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>You voted: {userVote}</span>
                </div>
                <VoteResults voteOptions={voteOptions} totalVotes={totalVotes} />
              </div>
            ) : (
              <div className="space-y-3">
                {voteOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.option_text)}
                    disabled={voting}
                    className="w-full text-left p-4 bg-surface border border-border rounded-lg hover:bg-surface-elevated hover:border-primary transition-all"
                  >
                    <div className="font-semibold text-text-emphasis">{option.option_text}</div>
                  </button>
                ))}
              </div>
            )}

            {totalVotes > 0 && !userVote && (
              <div className="mt-6 pt-6 border-t border-border">
                <VoteResults voteOptions={voteOptions} totalVotes={totalVotes} />
              </div>
            )}
          </div>
        )}

        {/* Results for closed proposals */}
        {proposal.status === 'closed' && totalVotes > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-text-emphasis mb-6">Final Results</h3>
            <VoteResults voteOptions={voteOptions} totalVotes={totalVotes} />
          </div>
        )}

        {/* Comments Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-text-emphasis">
              Discussion ({comments.length})
            </h3>
          </div>
          {comments.length === 0 ? (
            <p className="text-text-secondary text-center py-8">No comments yet. Be the first to discuss!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-background rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-semibold">
                        {comment.user?.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-text-emphasis text-sm">
                          {comment.user?.full_name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatRelativeTime(comment.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-sky-300">{comment.upvotes}</span>
                      <span className="text-red-400">{comment.downvotes}</span>
                    </div>
                  </div>
                  <p className="text-text-primary text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function VoteResults({ voteOptions, totalVotes }: { voteOptions: VoteOption[]; totalVotes: number }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-text-secondary mb-2">
        Total votes: {totalVotes}
      </div>
      {voteOptions.map((option) => {
        const percentage = calculatePercentage(option.vote_count, totalVotes);
        return (
          <div key={option.id}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-emphasis font-medium">{option.option_text}</span>
              <span className="text-text-secondary">
                {option.vote_count} votes ({percentage}%)
              </span>
            </div>
            <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
