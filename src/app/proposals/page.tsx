'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Proposal } from '@/types';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function ProposalsPage() {
  return (
    <ProtectedRoute>
      <ProposalsContent />
    </ProtectedRoute>
  );
}

function ProposalsContent() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'voting' | 'closed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, [filter]);

  async function loadProposals() {
    try {
      setLoading(true);
      let query = supabase
        .from('proposals')
        .select('*, communities(*), users(*)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-emphasis mb-2">Proposals</h1>
            <p className="text-text-secondary">Browse and vote on community proposals</p>
          </div>
          <Link href="/proposals/create" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Proposal
          </Link>
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
            All Proposals
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('voting')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'voting'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            Voting Now
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'closed'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            Closed
          </button>
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-surface-elevated rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-elevated rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-elevated rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary mb-4">No proposals found</p>
            <Link href="/proposals/create" className="btn btn-primary">
              Create First Proposal
            </Link>
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
                        : proposal.status === 'active' || proposal.status === 'collecting_signatures'
                        ? 'badge-primary'
                        : proposal.status === 'closed'
                        ? 'badge-error'
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
                  <span>{proposal.community?.name}</span>
                  <span>•</span>
                  <span>by {proposal.author?.full_name}</span>
                  <span>•</span>
                  <span>{formatDate(proposal.created_at)}</span>
                  {proposal.proposal_type === 'popular_initiative' && (
                    <>
                      <span>•</span>
                      <span className="text-primary">
                        {proposal.signature_count}/{proposal.signature_threshold} signatures
                      </span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
