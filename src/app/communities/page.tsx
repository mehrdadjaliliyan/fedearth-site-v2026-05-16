'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Community } from '@/types';
import { Users, Globe, MapPin, Building } from 'lucide-react';
import Link from 'next/link';

export default function CommunitiesPage() {
  return (
    <ProtectedRoute>
      <CommunitiesContent />
    </ProtectedRoute>
  );
}

function CommunitiesContent() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filter, setFilter] = useState<'all' | 'local' | 'regional' | 'global'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, [filter]);

  async function loadCommunities() {
    try {
      setLoading(true);
      let query = supabase
        .from('communities')
        .select('*')
        .order('member_count', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('tier', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'local':
        return <MapPin className="w-5 h-5" />;
      case 'regional':
        return <Building className="w-5 h-5" />;
      case 'global':
        return <Globe className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-emphasis mb-2">Communities</h1>
          <p className="text-text-secondary">
            Join local, regional, or global communities to participate in governance
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            All Communities
          </button>
          <button
            onClick={() => setFilter('local')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'local'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Local
          </button>
          <button
            onClick={() => setFilter('regional')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'regional'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            <Building className="w-4 h-4 inline mr-1" />
            Regional
          </button>
          <button
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'global'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-1" />
            Global
          </button>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-surface-elevated rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-elevated rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-elevated rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : communities.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-text-secondary">No communities found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.id}`}
                className="card card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      {getTierIcon(community.tier)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-emphasis">
                        {community.name}
                      </h3>
                      <span
                        className={`text-xs ${
                          community.tier === 'local'
                            ? 'text-primary'
                            : community.tier === 'regional'
                            ? 'text-accent-soft'
                            : 'text-sky-300'
                        }`}
                      >
                        {community.tier.charAt(0).toUpperCase() + community.tier.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {community.description}
                </p>
                <div className="flex items-center text-text-secondary text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {community.member_count} members
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
