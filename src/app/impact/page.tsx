import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import {
  FlaskConical,
  Layers,
  GraduationCap,
  Megaphone,
  ArrowUpRight,
  Target,
  Compass,
  Route,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impact & Programs',
  description:
    'Our programs: research, open-source technology, civic education, and advocacy. The four ways Federation of Earth pursues its mandate.',
};

const programs = [
  {
    tag: 'Program 01',
    icon: FlaskConical,
    title: 'Research & Protocol Design',
    body: "Field-independent study of direct-democracy mechanisms. We publish open working papers on signature thresholds, quorum rules, sortition, deliberative processes, and verifiable ballots. Research outputs are peer-reviewable and freely citable.",
    outputs: [
      'Working papers on direct-democracy mechanisms',
      'Comparative studies of referendum systems',
      'Audits of civic-tech vote-integrity schemes',
    ],
  },
  {
    tag: 'Program 02',
    icon: Layers,
    title: 'Open-Source Technology',
    body: "The Association develops and governs the reference implementation of the Federation platform. Code is permissively licensed, reproducibly built, and self-hostable. Per Art. 3, the Association may allocate grants for liquidity bootstrapping, research, and related development.",
    outputs: [
      'Reference platform (this site)',
      'Client libraries for common stacks',
      'Grants for aligned independent projects',
    ],
  },
  {
    tag: 'Program 03',
    icon: GraduationCap,
    title: 'Civic Education',
    body: 'Training materials, facilitator guides, and community-led workshops for teaching direct-democratic practice — from municipal councils to global coordination. Curricula are multilingual and pedagogically open.',
    outputs: [
      'Open curriculum for facilitators',
      'Workshops with community partners',
      'Multilingual translation program',
    ],
  },
  {
    tag: 'Program 04',
    icon: Megaphone,
    title: 'Advocacy & Policy',
    body: 'Strictly non-partisan, non-denominational advocacy for procedural rights: privacy of the ballot, freedom of political expression, and the equal weight of every vote. We brief policymakers and contribute to open standards.',
    outputs: [
      'Policy briefs (non-partisan)',
      'Coalition work on civic rights',
      'Contributions to open standards',
    ],
  },
];

export default function ImpactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        eyebrow="Impact"
        title="Four programs, one mandate —"
        accent="building the infrastructure of direct democracy."
        intro="Our programs translate Article 3 of the Articles of Association into public, auditable lines of work. Nothing here is proprietary to the Association — research, code, curriculum, and policy are all open."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {programs.map((p) => (
            <article key={p.title} className="card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
                  {p.tag}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
                  <p.icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="mt-5 font-display text-2xl text-text-emphasis">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{p.body}</p>
              <div className="my-5 divider-glow" />
              <ul className="space-y-2 text-sm text-text-secondary">
                {p.outputs.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-primary-light" />
                    {o}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Theory of change */}
      <section className="border-y border-border bg-ink-950/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Theory of Change</p>
            <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
              From <span className="italic grad-text-indigo">research</span> to{' '}
              <span className="italic grad-text-indigo">ratified law</span>.
            </h2>
            <p className="mt-4 text-text-secondary">
              We believe procedural infrastructure is upstream of political outcomes.
              Improve the process, and legitimacy follows.
            </p>
          </div>

          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            <ToCStep
              n="01"
              icon={<Target className="h-5 w-5" />}
              title="Study what works"
              body="Gather evidence from live direct-democracy systems (Switzerland, Taiwan's vTaiwan, citizen assemblies) and publish comparative findings."
            />
            <ToCStep
              n="02"
              icon={<Compass className="h-5 w-5" />}
              title="Encode it into tools"
              body="Translate research into reference implementations that communities can adopt, fork, or audit — lowering the cost of adopting better process."
            />
            <ToCStep
              n="03"
              icon={<Route className="h-5 w-5" />}
              title="Scale through partners"
              body="Support municipalities, universities, and civic orgs in piloting the tools; feed learnings back into research. Recurse."
            />
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <p className="eyebrow">What&apos;s next</p>
        <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
          Partner on a pilot, or join the research group.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Propose a partnership <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/join" className="btn btn-secondary">
            See all ways to contribute
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ToCStep({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="card">
      <div className="flex items-center justify-between">
        <span className="font-display text-5xl text-primary-light/90">{n}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
          {icon}
        </div>
      </div>
      <h3 className="mt-6 font-display text-2xl text-text-emphasis">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
    </li>
  );
}
