'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Community, Proposal } from '@/types';
import { Users, FileText, UserPlus, UserMinus, Globe, MapPin, Building } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function CommunityDetailPage() {
  return (
    <ProtectedRoute>
      <CommunityDetailContent />
    </ProtectedRoute>
  );
}

function CommunityDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const communityId = params.id as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (communityId && user) {
      loadCommunityData();
    }
  }, [communityId, user]);

  async function loadCommunityData() {
    try {
      // Load community details
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      if (communityError) throw communityError;
      setCommunity(communityData);

      // Check membership
      const { data: memberData } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_id', user?.id)
        .maybeSingle();

      setIsMember(!!memberData);

      // Load proposals
      const { data: proposalData } = await supabase
        .from('proposals')
        .select('*, users(*)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false })
        .limit(10);

      setProposals(proposalData || []);
    } catch (error) {
      console.error('Error loading community:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinLeave() {
    if (!user) return;

    try {
      setJoining(true);

      if (isMember) {
        // Leave community
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsMember(false);
      } else {
        // Join community
        const { error } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            user_id: user.id,
            role: 'member',
          });

        if (error) throw error;
        setIsMember(true);
      }

      // Reload to update member count
      loadCommunityData();
    } catch (error: any) {
      console.error('Error joining/leaving community:', error);
      alert(error.message);
    } finally {
      setJoining(false);
    }
  }

  const getTierIcon = () => {
    if (!community) return <Users className="w-6 h-6" />;
    switch (community.tier) {
      case 'local':
        return <MapPin className="w-6 h-6" />;
      case 'regional':
        return <Building className="w-6 h-6" />;
      case 'global':
        return <Globe className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="card animate-pulse">
            <div className="h-8 bg-surface-elevated rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-surface-elevated rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-elevated rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="card text-center py-12">
            <p className="text-text-secondary mb-4">Community not found</p>
            <Link href="/communities" className="btn btn-primary">
              Browse Communities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                {getTierIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-emphasis mb-2">{community.name}</h1>
                <span
                  className={`badge ${
                    community.tier === 'local'
                      ? 'badge-primary'
                      : community.tier === 'regional'
                      ? 'badge-warning'
                      : 'badge-success'
                  }`}
                >
                  {community.tier.charAt(0).toUpperCase() + community.tier.slice(1)} Community
                </span>
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              disabled={joining}
              className={`btn ${isMember ? 'btn-secondary' : 'btn-primary'}`}
            >
              {joining ? (
                'Loading...'
              ) : isMember ? (
                <>
                  <UserMinus className="w-4 h-4 mr-2" />
                  Leave
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join
                </>
              )}
            </button>
          </div>

          <p className="text-text-secondary mb-6">{community.description}</p>

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {community.member_count} members
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {proposals.length} proposals
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {isMember && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link
              href={`/proposals/create?community=${communityId}`}
              className="card card-hover text-center py-6"
            >
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-text-emphasis">Create Proposal</h3>
              <p className="text-sm text-text-secondary">Start a new initiative</p>
            </Link>
            <Link href={`/communities/${communityId}/elections`} className="card card-hover text-center py-6">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-text-emphasis">View Elections</h3>
              <p className="text-sm text-text-secondary">Participate in representative elections</p>
            </Link>
          </div>
        )}

        {/* Proposals List */}
        <div>
          <h2 className="text-2xl font-bold text-text-emphasis mb-6">Community Proposals</h2>
          {proposals.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-secondary mb-4">No proposals yet in this community</p>
              {isMember && (
                <Link href={`/proposals/create?community=${communityId}`} className="btn btn-primary">
                  Create First Proposal
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href={`/proposals/${proposal.id}`}
                  className="card card-hover block"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-emphasis flex-1">
                      {proposal.title}
                    </h3>
                    <span
                      className={`badge ${
                        proposal.status === 'voting'
                          ? 'badge-success'
                          : proposal.status === 'active'
                          ? 'badge-primary'
                          : 'badge-warning'
                      }`}
                    >
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                    {proposal.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>by {proposal.author?.full_name}</span>
                    <span>•</span>
                    <span>{formatDate(proposal.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
