'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import {
  Mail,
  MapPin,
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  buildMailtoUrl,
  submitApplication,
  type ApplicationKind,
} from '@/lib/applications';

type Kind = Extract<ApplicationKind, 'contact' | 'partner' | 'donor'>;

export default function ContactPage() {
  const [kind, setKind] = useState<Kind>('contact');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [resp, setResp] = useState<string>('');
  const [mailtoUrl, setMailtoUrl] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    const payload = {
      kind,
      fullName,
      email,
      reason,
      message,
      metadata: { source: 'contact-form' },
    };
    const result = await submitApplication(payload);
    setResp(result.message);
    if (result.transport === 'mailto') {
      const url = buildMailtoUrl(payload, result.mailto);
      setMailtoUrl(url);
      // Auto-open the user's email client so the message reaches the inbox
      // even when no SMTP relay is configured on the host.
      if (typeof window !== 'undefined') window.location.href = url;
    }
    setState('ok');
  };

  if (state === 'ok') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-24 text-center">
          <div className="card w-full">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky/15 text-sky">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-3xl text-text-emphasis">
              Message received
            </h2>
            <p className="mt-3 text-sm text-text-secondary">{resp}</p>
            {mailtoUrl && (
              <a href={mailtoUrl} className="btn btn-primary mt-6 mx-auto inline-flex">
                <Mail className="h-4 w-4" /> Open in your email app
              </a>
            )}
            <p className="mt-6 text-xs text-text-muted">
              A board member will reply from{' '}
              <span className="font-mono text-sky-soft">contact@fedearth.org</span>.
            </p>
            <Link href="/" className="btn btn-secondary mt-8">
              Back to home
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        eyebrow="Contact"
        title="Reach the"
        accent="Management Board."
        intro="For media requests, partnerships, grant agreements, or general enquiries. Routine messages reach the Management Board inbox within two business days."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Details */}
        <aside className="space-y-5 lg:col-span-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">Email</p>
                <a
                  href="mailto:contact@fedearth.org"
                  className="font-mono text-sm text-text-emphasis hover:text-primary-light"
                >
                  contact@fedearth.org
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Registered office
                </p>
                <address className="not-italic text-sm text-text-emphasis">
                  Gublerstrasse 24<br />
                  6300 Zug, Switzerland
                </address>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Legal form
                </p>
                <p className="text-sm text-text-emphasis">
                  Swiss Verein · Art. 60 ZGB
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Handelsregisteramt des Kantons Zug
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            Press and policy enquiries: attach your outlet and deadline. Partnership
            proposals: attach a short brief (≤ 1 page).
          </p>
        </aside>

        {/* Form */}
        <form onSubmit={submit} className="card lg:col-span-8">
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 font-display text-3xl text-text-emphasis">
            We read every message.
          </h2>

          {/* Kind tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                { k: 'contact' as Kind, label: 'General' },
                { k: 'partner' as Kind, label: 'Partnership' },
                { k: 'donor' as Kind, label: 'Foundation / Grant' },
              ]
            ).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setKind(opt.k)}
                className={[
                  'chip transition',
                  kind === opt.k
                    ? 'border-primary/50 bg-primary/15 text-primary-light'
                    : 'hover:border-primary/40 hover:text-text-emphasis',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">Full name</label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                required
                disabled={state === 'loading'}
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
                required
                disabled={state === 'loading'}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="reason" className="label">Subject</label>
            <input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input"
              placeholder="One sentence"
              required
              disabled={state === 'loading'}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="label">Message</label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input resize-y"
              placeholder="Context, constraints, deadline if any…"
              required
              disabled={state === 'loading'}
            />
          </div>

          {state === 'err' && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              {resp}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              Your message is sent to{' '}
              <span className="font-mono text-sky-soft">contact@fedearth.org</span>.
            </p>
            <button
              type="submit"
              className="btn btn-primary min-w-[170px] justify-center"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send message <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
}
