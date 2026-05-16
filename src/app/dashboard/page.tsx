'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Community, Proposal } from '@/types';
import { Users, FileText, Vote, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState({
    myCommunitiesCount: 0,
    activeProposalsCount: 0,
    myVotesCount: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  async function loadDashboardData() {
    try {
      // Load user's communities
      const { data: memberData } = await supabase
        .from('community_members')
        .select('community_id, communities(*)')
        .eq('user_id', user?.id)
        .limit(5);

      if (memberData) {
        const userCommunities = memberData
          .map((m: any) => m.communities)
          .filter(Boolean);
        setCommunities(userCommunities);
        setStats((prev) => ({ ...prev, myCommunitiesCount: userCommunities.length }));
      }

      // Load recent proposals from user's communities
      if (memberData && memberData.length > 0) {
        const communityIds = memberData.map((m: any) => m.community_id);
        const { data: proposalData } = await supabase
          .from('proposals')
          .select('*, communities(*), users(*)')
          .in('community_id', communityIds)
          .in('status', ['active', 'voting'])
          .order('created_at', { ascending: false })
          .limit(5);

        if (proposalData) {
          setProposals(proposalData as any);
          setStats((prev) => ({ ...prev, activeProposalsCount: proposalData.length }));
        }
      }

      // Load vote count
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setStats((prev) => ({ ...prev, myVotesCount: count || 0 }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-emphasis mb-2">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-text-secondary">
            {user?.role === 'admin' && 'Administrator Dashboard'}
            {user?.role === 'moderator' && 'Moderator Dashboard'}
            {user?.role === 'representative' && 'Representative Dashboard'}
            {user?.role === 'member' && 'Member Dashboard'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="My Communities"
            value={stats.myCommunitiesCount}
            color="primary"
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Active Proposals"
            value={stats.activeProposalsCount}
            color="accent"
          />
          <StatCard
            icon={<Vote className="w-6 h-6" />}
            title="My Votes"
            value={stats.myVotesCount}
            color="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Participation Rate"
            value={stats.myVotesCount > 0 && stats.activeProposalsCount > 0
              ? `${Math.round((stats.myVotesCount / stats.activeProposalsCount) * 100)}%`
              : '0%'}
            color="accent"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/communities" className="card card-hover">
            <h3 className="text-lg font-semibold text-text-emphasis mb-2">Browse Communities</h3>
            <p className="text-text-secondary text-sm">Join local, regional, or global communities</p>
          </Link>
          <Link href="/proposals" className="card card-hover">
            <h3 className="text-lg font-semibold text-text-emphasis mb-2">View Proposals</h3>
            <p className="text-text-secondary text-sm">Vote on active proposals and initiatives</p>
          </Link>
          <Link href="/proposals/create" className="card card-hover">
            <h3 className="text-lg font-semibold text-text-emphasis mb-2">Create Proposal</h3>
            <p className="text-text-secondary text-sm">Start a new popular initiative</p>
          </Link>
        </div>

        {/* My Communities */}
        {communities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-emphasis mb-6">My Communities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  href={`/communities/${community.id}`}
                  className="card card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-text-emphasis">{community.name}</h3>
                    <span className={`badge ${
                      community.tier === 'local' ? 'badge-primary' :
                      community.tier === 'regional' ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {community.tier}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="text-text-secondary text-xs">
                    <Users className="w-4 h-4 inline mr-1" />
                    {community.member_count} members
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Active Proposals */}
        {proposals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-emphasis mb-6">Active Proposals</h2>
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
                    <span className={`badge ${
                      proposal.status === 'voting' ? 'badge-success' :
                      proposal.status === 'active' ? 'badge-primary' :
                      'badge-warning'
                    }`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                    {proposal.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>{proposal.community?.name}</span>
                    <span>•</span>
                    <span>by {proposal.author?.full_name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {proposals.length === 0 && communities.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-text-secondary mb-4">
              You haven't joined any communities yet
            </p>
            <Link href="/communities" className="btn btn-primary">
              Browse Communities
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, color }: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: 'primary' | 'accent'
}) {
  return (
    <div className="card">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        color === 'primary' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
      }`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-text-emphasis mb-1">{value}</div>
      <div className="text-sm text-text-secondary">{title}</div>
    </div>
  );
}
