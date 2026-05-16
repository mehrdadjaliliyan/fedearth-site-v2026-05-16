import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import {
  Users2,
  HeartHandshake,
  Sparkles,
  ArrowUpRight,
  Code2,
  Languages,
  BookOpenCheck,
  Mic,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join the Movement',
  description:
    'Three paths to stand with the Federation of Earth: become a member, volunteer, or partner.',
};

export default function JoinPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        eyebrow="Get Involved"
        title="A direct-democracy infrastructure is built by"
        accent="the people it serves."
        intro="Whether you have an hour a week, a research skill, or an organisation behind you — there is a role for you."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Path
            icon={<Users2 />}
            eyebrow="01 · Membership"
            title="Become a Member"
            body="One member, one vote in the General Assembly. Members apply electronically; admission is on a good-repute basis under Art. 6."
            cta="Apply for membership"
            href="/auth/register"
          />
          <Path
            icon={<HeartHandshake />}
            eyebrow="02 · Volunteering"
            title="Contribute your skills"
            body="Translation, research, facilitation, engineering — all public. Start with an open area below and we will connect you to a working group."
            cta="Start volunteering"
            href="/contact"
          />
          <Path
            icon={<Sparkles />}
            eyebrow="03 · Partnership"
            title="Partner with us"
            body="Municipalities, universities, and civic orgs: co-design pilots, audits, or research programs. Partnership terms are published for transparency."
            cta="Propose a partnership"
            href="/contact"
          />
        </div>

        {/* Volunteer focus areas */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Where help is most welcome</p>
            <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
              Four areas open today.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Focus
              icon={<Code2 />}
              title="Engineering"
              body="TypeScript, Postgres, smart contracts, reproducible infra."
            />
            <Focus
              icon={<BookOpenCheck />}
              title="Research"
              body="Comparative democracy, mechanism design, deliberative processes."
            />
            <Focus
              icon={<Languages />}
              title="Translation"
              body="Core materials translated into your first language."
            />
            <Focus
              icon={<Mic />}
              title="Facilitation"
              body="Running workshops, assemblies, community consultations."
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Link href="/contact" className="btn btn-primary">
            Tell us how you&apos;d like to contribute <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-text-muted">
            Replies are sent from{' '}
            <span className="font-mono text-sky-soft">contact@fedearth.org</span>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Path({
  icon,
  eyebrow,
  title,
  body,
  cta,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        'card card-hover group flex flex-col',
        highlight ? 'shimmer-border' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div
          className={[
            'flex h-11 w-11 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5',
            highlight
              ? 'border border-accent/40 bg-accent/10 text-accent-soft'
              : 'border border-primary/30 bg-primary/10 text-primary-light',
          ].join(' ')}
        >
          {icon}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-6 font-display text-2xl text-text-emphasis">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{body}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-light transition group-hover:text-white">
        {cta} <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function Focus({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card card-hover">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-emphasis">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}
