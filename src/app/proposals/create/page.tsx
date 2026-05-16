'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Community } from '@/types';

export default function CreateProposalPage() {
  return (
    <ProtectedRoute>
      <CreateProposalContent />
    </ProtectedRoute>
  );
}

function CreateProposalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    community_id: searchParams.get('community') || '',
    proposal_type: 'standard' as 'standard' | 'popular_initiative',
    vote_type: 'yes_no' as 'yes_no' | 'multiple_choice',
  });
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserCommunities();
  }, [user]);

  async function loadUserCommunities() {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('communities(*)')
        .eq('user_id', user?.id);

      if (error) throw error;
      const userCommunities = data?.map((m: any) => m.communities).filter(Boolean) || [];
      setCommunities(userCommunities);
    } catch (error) {
      console.error('Error loading communities:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.community_id) {
        throw new Error('Please select a community');
      }

      // Get community member count for threshold calculation
      const { data: communityData } = await supabase
        .from('communities')
        .select('member_count')
        .eq('id', formData.community_id)
        .single();

      const memberCount = communityData?.member_count || 0;
      const signatureThreshold = formData.proposal_type === 'popular_initiative'
        ? Math.ceil(memberCount * 0.05) // 5% threshold
        : 0;

      const campaignDays = formData.proposal_type === 'popular_initiative' ? 30 : 0;
      const campaignEndDate = campaignDays > 0
        ? new Date(Date.now() + campaignDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Create proposal
      const { data: proposalData, error: proposalError } = await supabase
        .from('proposals')
        .insert({
          title: formData.title,
          description: formData.description,
          community_id: formData.community_id,
          author_id: user?.id,
          proposal_type: formData.proposal_type,
          vote_type: formData.vote_type,
          status: formData.proposal_type === 'popular_initiative' ? 'collecting_signatures' : 'active',
          signature_threshold: signatureThreshold,
          campaign_end_date: campaignEndDate,
        })
        .select()
        .single();

      if (proposalError) throw proposalError;

      // Create vote options for multiple choice
      if (formData.vote_type === 'multiple_choice') {
        const options = multipleChoiceOptions.filter(opt => opt.trim());
        if (options.length < 2) {
          throw new Error('Multiple choice requires at least 2 options');
        }

        const voteOptions = options.map((opt, index) => ({
          proposal_id: proposalData.id,
          option_text: opt,
          display_order: index,
        }));

        const { error: optionsError } = await supabase
          .from('vote_options')
          .insert(voteOptions);

        if (optionsError) throw optionsError;
      } else {
        // Create Yes/No options
        const { error: optionsError } = await supabase
          .from('vote_options')
          .insert([
            { proposal_id: proposalData.id, option_text: 'Yes', display_order: 0 },
            { proposal_id: proposalData.id, option_text: 'No', display_order: 1 },
          ]);

        if (optionsError) throw optionsError;
      }

      // Create audit log
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'create_proposal',
        entity_type: 'proposal',
        entity_id: proposalData.id,
        details: { title: formData.title, community_id: formData.community_id },
      });

      router.push(`/proposals/${proposalData.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-text-emphasis mb-8">Create Proposal</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label">Community</label>
            <select
              value={formData.community_id}
              onChange={(e) => setFormData({ ...formData, community_id: e.target.value })}
              className="input"
              required
              disabled={loading}
            >
              <option value="">Select a community</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name} ({community.tier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Proposal Type</label>
            <select
              value={formData.proposal_type}
              onChange={(e) =>
                setFormData({ ...formData, proposal_type: e.target.value as any })
              }
              className="input"
              disabled={loading}
            >
              <option value="standard">Standard Proposal</option>
              <option value="popular_initiative">Popular Initiative (requires signatures)</option>
            </select>
            {formData.proposal_type === 'popular_initiative' && (
              <p className="text-xs text-text-secondary mt-1">
                Popular initiatives require 5% of community members to sign before voting can begin.
                Campaign duration: 30 days.
              </p>
            )}
          </div>

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Brief title for your proposal"
              required
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[150px]"
              placeholder="Detailed description of your proposal..."
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Vote Type</label>
            <select
              value={formData.vote_type}
              onChange={(e) => setFormData({ ...formData, vote_type: e.target.value as any })}
              className="input"
              disabled={loading}
            >
              <option value="yes_no">Yes / No</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          {formData.vote_type === 'multiple_choice' && (
            <div>
              <label className="label">Vote Options</label>
              {multipleChoiceOptions.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...multipleChoiceOptions];
                      newOptions[index] = e.target.value;
                      setMultipleChoiceOptions(newOptions);
                    }}
                    className="input flex-1"
                    placeholder={`Option ${index + 1}`}
                    required
                    disabled={loading}
                  />
                  {multipleChoiceOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = multipleChoiceOptions.filter((_, i) => i !== index);
                        setMultipleChoiceOptions(newOptions);
                      }}
                      className="btn btn-secondary px-4"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMultipleChoiceOptions([...multipleChoiceOptions, ''])}
                className="btn btn-secondary text-sm mt-2"
                disabled={loading}
              >
                Add Option
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Proposal'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
