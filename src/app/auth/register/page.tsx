'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ArrowRight, CheckCircle2, Fingerprint, Mail } from 'lucide-react';
import { buildMailtoUrl, submitApplication } from '@/lib/applications';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSupabaseConfigured) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    const payload = {
      kind: 'member' as const,
      fullName,
      email,
      consent: true,
      metadata: { source: 'register-form' },
    };
    const result = await submitApplication(payload);

    if (isSupabaseConfigured) {
      try {
        await signUp(email, password, fullName);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to create account');
        setLoading(false);
        return;
      }
    }

    if (result.transport === 'mailto') {
      const url = buildMailtoUrl(payload, result.mailto);
      setMailtoUrl(url);
      if (typeof window !== 'undefined') window.location.href = url;
    }

    setSuccess(true);
    if (isSupabaseConfigured) {
      setTimeout(() => router.push('/dashboard'), 2200);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky/15 text-sky">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-display text-3xl text-text-emphasis">Application received</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Thank you. Your application is on its way to{' '}
            <span className="font-mono text-sky-soft">contact@fedearth.org</span>. A board
            member will review it and contact you shortly.
          </p>
          {mailtoUrl && (
            <a href={mailtoUrl} className="btn btn-primary mt-6 inline-flex">
              Open in your email app
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-radial-spotlight" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-4 py-16">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-text-muted hover:text-text-secondary transition">
              ← Federation of Earth
            </Link>
            <h1 className="mt-6 font-display text-4xl text-text-emphasis">
              Apply for <em className="italic grad-text">membership</em>.
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              One member. One vote. Equal footing under Art. 6.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-5">
            {!isSupabaseConfigured && (
              <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-text-secondary">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light" />
                <p>
                  Your application is sent directly to{' '}
                  <span className="font-mono text-sky-soft">contact@fedearth.org</span>. A
                  board member will review it and reply by email. On-chain account
                  onboarding is being rolled out separately.
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-text-secondary">
              <Fingerprint className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light" />
              <p>
                Per Article 6 of the Articles of Association, membership is applied for
                electronically and attested on-chain. Email credentials bootstrap your
                identity while on-chain onboarding is rolled out.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="Ada Lovelace"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            {isSupabaseConfigured && (
              <>
                <div>
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Submitting…' : <>Submit Application <ArrowRight className="h-4 w-4" /></>}
            </button>

            <p className="text-center text-[11px] text-text-muted">
              By applying you acknowledge the{' '}
              <Link href="/legal" className="link">Articles of Association</Link>{' '}
              and equal footing of all members.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already a member?{' '}
            <Link href="/auth/login" className="text-primary-light hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
