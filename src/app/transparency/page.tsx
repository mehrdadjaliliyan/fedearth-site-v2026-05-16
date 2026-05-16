import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Scale, Landmark, Users2, FileText, ShieldCheck, Eye, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transparency & Governance',
  description:
    'How the Federation is governed, audited, and held accountable — in plain language. All figures and policies derive from the Articles of Association.',
};

export default function TransparencyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        eyebrow="Transparency"
        title="Accountable by design,"
        accent="not by press release."
        intro="Every power exercised by the Federation derives from the Articles of Association signed on 7 November 2025. This page translates the formal document into operational commitments."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Card
            icon={<Users2 className="h-5 w-5" />}
            title="Sovereign Assembly"
            body="The General Assembly is the supreme body. Each member has one vote. Ordinary assemblies are annual; extraordinary assemblies can be called by 1/5 of members at any time."
            cite="Art. 13–14"
          />
          <Card
            icon={<Landmark className="h-5 w-5" />}
            title="Limited Executive"
            body="The Management Board prepares and executes assemblies, adopts regulations, and manages admissions — but binds the Association only by joint signature of two."
            cite="Art. 21"
          />
          <Card
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Scale-Triggered Audit"
            body="External audit is mandatory if 2 of 3 thresholds are exceeded in two successive years: CHF 10M total assets, CHF 20M turnover, 50 FTE avg. No discretionary opt-out."
            cite="Art. 22–23"
          />
        </div>

        {/* Financial policy */}
        <div className="mt-12 card">
          <p className="eyebrow">Financial policy</p>
          <h2 className="mt-3 font-display text-3xl text-text-emphasis">
            Non-profit, on- and off-chain.
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
                Sources of funds
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li className="flex gap-2"><Dot /> Membership fees set by the General Assembly</li>
                <li className="flex gap-2"><Dot /> On- and off-chain donations</li>
                <li className="flex gap-2"><Dot /> Public or private grants and subsidies</li>
                <li className="flex gap-2"><Dot /> Fees from service providers where applicable</li>
                <li className="flex gap-2"><Dot /> Gifts and contributions permitted by law</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
                Use of funds
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li className="flex gap-2"><Dot /> Liquidity bootstrapping for aligned projects</li>
                <li className="flex gap-2"><Dot /> Research, development, and related activities</li>
                <li className="flex gap-2"><Dot /> Running the reference platform</li>
                <li className="flex gap-2"><Dot /> Civic-education and advocacy programs</li>
                <li className="flex gap-2"><Dot /> Administration and statutory compliance</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-text-muted">
            The Association does not strive for profit. Members and Board members
            bear no personal liability for the Association&apos;s obligations (Art. 25).
          </p>
        </div>

        {/* Rights */}
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Card
            icon={<Eye className="h-5 w-5" />}
            title="Ballot privacy"
            body="Individual votes are private by design. Only aggregate results are public. No political-participation surveillance."
            cite="Platform policy"
          />
          <Card
            icon={<Scale className="h-5 w-5" />}
            title="Equal footing"
            body='"All Members shall be on equal footing." No weighted voting, no tiered classes. Admission criteria: trustworthiness and good repute.'
            cite="Art. 6"
          />
          <Card
            icon={<FileText className="h-5 w-5" />}
            title="Open agendas"
            body="Assembly agendas are announced at least 20 days in advance via electronic publication. Any member may submit items up to four weeks before the meeting."
            cite="Art. 13"
          />
        </div>

        {/* Reporting */}
        <div className="mt-12 card">
          <p className="eyebrow">Reporting</p>
          <h2 className="mt-3 font-display text-3xl text-text-emphasis">
            Annual reports, published.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            The Management Board reports annually to the General Assembly on
            transparency and diversity matters. Financial statements are presented
            for approval at each ordinary assembly. When the scale thresholds are
            crossed, the auditors&apos; report is published alongside the financials.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/legal" className="btn btn-secondary">
              Read Articles of Association <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Request past records
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Dot() {
  return <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-primary-light" />;
}

function Card({
  icon,
  title,
  body,
  cite,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cite: string;
}) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
          {icon}
        </div>
        <span className="font-mono text-[10px] tracking-[0.22em] text-text-muted">
          {cite}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-text-emphasis">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}
