'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ArrowRight, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="mt-6 font-display text-4xl text-text-emphasis">Welcome back.</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign in to exercise your membership rights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-5">
            {!isSupabaseConfigured && (
              <div className="flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 p-3 text-xs text-accent-soft">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Backend not configured. Set{' '}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> in{' '}
                  <code className="font-mono">.env.local</code> to enable sign-in.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

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
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            New here?{' '}
            <Link href="/auth/register" className="text-primary-light hover:text-white">
              Apply for membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
