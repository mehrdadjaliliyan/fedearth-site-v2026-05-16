'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Users, FileText, Vote, TrendingUp, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCommunities: 0,
    totalProposals: 0,
    totalVotes: 0,
    activeProposals: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);

      const [users, communities, proposals, votes, activeProposals, recentUsers] =
        await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('communities').select('*', { count: 'exact', head: true }),
          supabase.from('proposals').select('*', { count: 'exact', head: true }),
          supabase.from('votes').select('*', { count: 'exact', head: true }),
          supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .in('status', ['active', 'voting']),
          supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        ]);

      setStats({
        totalUsers: users.count || 0,
        totalCommunities: communities.count || 0,
        totalProposals: proposals.count || 0,
        totalVotes: votes.count || 0,
        activeProposals: activeProposals.count || 0,
        recentSignups: recentUsers.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-emphasis mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">Manage users, communities, and platform analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={stats.totalUsers}
            subtext={`+${stats.recentSignups} this week`}
            loading={loading}
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            title="Communities"
            value={stats.totalCommunities}
            loading={loading}
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Total Proposals"
            value={stats.totalProposals}
            subtext={`${stats.activeProposals} active`}
            loading={loading}
          />
          <StatCard
            icon={<Vote className="w-6 h-6" />}
            title="Total Votes"
            value={stats.totalVotes}
            loading={loading}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Participation Rate"
            value={
              stats.totalUsers > 0 && stats.totalVotes > 0
                ? `${Math.round((stats.totalVotes / stats.totalUsers) * 10) / 10}`
                : '0'
            }
            subtext="votes per user"
            loading={loading}
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Active Now"
            value={stats.activeProposals}
            subtext="proposals"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/admin/users" className="card card-hover text-center py-8">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-emphasis mb-1">User Management</h3>
            <p className="text-sm text-text-secondary">Manage roles and permissions</p>
          </Link>
          <Link href="/admin/communities" className="card card-hover text-center py-8">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-emphasis mb-1">Communities</h3>
            <p className="text-sm text-text-secondary">Create and manage communities</p>
          </Link>
          <Link href="/admin/audit" className="card card-hover text-center py-8">
            <Activity className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-emphasis mb-1">Audit Logs</h3>
            <p className="text-sm text-text-secondary">View all platform activity</p>
          </Link>
          <Link href="/admin/analytics" className="card card-hover text-center py-8">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-text-emphasis mb-1">Analytics</h3>
            <p className="text-sm text-text-secondary">Detailed insights and reports</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold text-text-emphasis mb-6">Platform Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-text-emphasis mb-3">Platform Health</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span>All systems operational</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span>Database healthy</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span>Real-time updates active</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-emphasis mb-3">Quick Stats</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>Average votes per proposal: {stats.totalProposals > 0 ? Math.round(stats.totalVotes / stats.totalProposals) : 0}</li>
                <li>Most active tier: [To be calculated]</li>
                <li>Avg. community size: {stats.totalCommunities > 0 ? Math.round(stats.totalUsers / stats.totalCommunities) : 0} members</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtext,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtext?: string;
  loading: boolean;
}) {
  return (
    <div className="card">
      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-surface-elevated rounded w-20 mb-2"></div>
          <div className="h-4 bg-surface-elevated rounded w-32"></div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold text-text-emphasis mb-1">{value}</div>
          <div className="text-sm text-text-secondary">{title}</div>
          {subtext && <div className="text-xs text-text-secondary mt-1">{subtext}</div>}
        </>
      )}
    </div>
  );
}
