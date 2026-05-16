import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, FileText, Scale, Landmark, Users2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Articles of Association',
  description:
    'Articles of Association of Federation of Earth (fedearth) — a Swiss non-profit Verein registered in Zug, Switzerland.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-radial-spotlight" />
        <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-emphasis transition">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <p className="eyebrow">Constitutional Document</p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-balance">
            Articles of Association of the <span className="italic grad-text">Federation of Earth</span>
          </h1>
          <p className="mt-5 max-w-2xl text-text-secondary">
            An Association according to articles 60 <em>et seq.</em> of the Swiss Civil Code,
            dated 7 November 2025, registered office Gublerstrasse 24, 6300 Zug.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip chip-primary"><FileText className="h-3 w-3" /> Art. 60 ZGB</span>
            <span className="chip chip-accent">Non-profit</span>
            <span className="chip chip-sky">Zug · CH</span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <TOC />

        <Section id="i-general" eyebrow="Chapter I" title="General Provisions">
          <Art n="1" title="Name">
            Under the name <strong className="text-text-emphasis">Federation of earth (fedearth)</strong>
            an Association according to articles 60 <em>et seq.</em> of the Swiss Civil Code exists.
          </Art>
          <Art n="2" title="Seat">
            The Association&apos;s registered office shall be in Zug, Switzerland.
          </Art>
          <Art n="3" title="Purpose">
            <p>
              The purpose of the Association is to develop and support technology for the
              creation of tools and concepts to foster direct democracy worldwide. The
              Association may create and/or govern one or multiple proprietary or
              non-proprietary technology tools.
            </p>
            <p>The Association is non-partisan and non-denominational.</p>
            <p>
              The Association may raise funds on- or off-chain, conduct and promote all
              businesses and/or enter into all transactions and generally perform all acts
              as may be necessary, appropriate, incidental or desirable to assist in
              achieving or furthering its purpose.
            </p>
            <p>
              It may allocate grants for liquidity bootstrapping, research, development and
              related activities, and the undertaking and participation in any other
              activities that support and promote such projects.
            </p>
            <p className="text-text-emphasis italic">The Association does not strive for profit.</p>
            <p>
              The Association may hold participations in other companies, and acquire,
              exploit, administer and dispose of tokens, real estate and intellectual
              property rights. It may also establish subsidiaries and branch offices in
              Switzerland and abroad and carry out all acts implicated by its purpose or
              which may be appropriate to promote its development.
            </p>
          </Art>
          <Art n="4" title="Organisational Structure">
            The organisation of the Association consists of the bodies of the Association.
            The Association can issue rules and regulations based on these Articles of
            Association (&laquo;Regulation&raquo;).
          </Art>
          <Art n="5" title="Duration">
            The duration of the Association is not limited in time.
          </Art>
        </Section>

        <Section id="ii-membership" eyebrow="Chapter III" title="Membership">
          <Art n="6" title="Admission to Membership">
            The Association shall exclusively consist of Members that are trustworthy and
            of good repute. <strong className="text-text-emphasis">All Members shall be on equal footing.</strong>
            Members must apply electronically on-chain. More detailed instructions for
            application are provided by the Association.
          </Art>
          <Art n="7" title="Membership Fee">
            The General Assembly decides on the annual Membership fee, which has to be
            paid by each Member at the beginning of the business year, if any.
          </Art>
          <Art n="8" title="Termination of Membership">
            Membership ends by exclusion, resignation or liquidation of the Association.
            Members who resign or are excluded have no right to a share in the assets and
            no refund of fees paid.
          </Art>
          <Art n="9" title="Exclusion of Members">
            Possible reasons to exclude a Member include: material breach of the Articles
            or applicable law; bringing the Association or related technology into
            disrepute; non-compliance with obligations despite reminder; or non-payment of
            the Membership Fee despite reminder.
          </Art>
          <Art n="10" title="Resignation of Membership">
            A Member may resign from Membership electronically at any time.
          </Art>
          <Art n="11" title="Rights of Members">
            Subject to the availability of sufficient funds, each Member is entitled to
            participate in the General Assembly and in any way and form set forth in the
            Regulations. Each Member is responsible to exercise its rights and obligations
            on a best-effort basis.
          </Art>
        </Section>

        <Section id="iii-org" eyebrow="Chapter IV" title="Organisation">
          <Art n="12" title="Bodies of the Association">
            <ul className="mt-2 list-inside space-y-1">
              <li>a. the General Assembly</li>
              <li>b. the Management Board</li>
              <li>c. the Auditors (if elected)</li>
            </ul>
          </Art>
          <Art n="13" title="General Assembly — Articles, Agenda, Participation">
            The General Assembly is the supreme body of the Association. The Chairman
            shall preside. The ordinary General Assembly takes place annually, normally
            online or virtually, using an electronic voting system. The agenda is
            announced at least 20 days in advance. <strong className="text-text-emphasis">Each Member has one vote.</strong>
          </Art>
          <Art n="14" title="Extraordinary General Assembly">
            Called by decision of the Management Board or General Assembly, by request of
            at least one-fifth of the Members, or by request of the auditor if elected.
          </Art>
          <Art n="15" title="Responsibilities of the General Assembly">
            Amending the Articles of Association; approving financial statements and the
            annual report; determining Membership Fees; electing the Management Board and
            Auditors; discharging the Management Board and Auditors.
          </Art>
          <Art n="21" title="Representation & Signatures">
            The Management Board and the Chairman publicly represent the Association. The
            Chairman plus any other Member of the Management Board shall have a right to
            bind the Association when signing <em>jointly by two</em>.
          </Art>
        </Section>

        <Section id="iv-audit" eyebrow="Chapter · Auditor" title="Audit">
          <Art n="22" title="General provisions">
            The Association generally refrains from auditing. However, a full audit by
            external auditors is mandatory if two of the following figures are exceeded in
            two successive business years:
            <ul className="mt-3 space-y-1">
              <li>a. total assets of CHF 10 million;</li>
              <li>b. turnover of CHF 20 million;</li>
              <li>c. average annual total of 50 full-time staff.</li>
            </ul>
          </Art>
          <Art n="23" title="Appointment of the auditor">
            If the conditions of Art. 22 are fulfilled, the General Assembly appoints the
            auditors. At least one member of the auditor must be resident in Switzerland,
            or have its registered office or a registered branch office in Switzerland.
          </Art>
        </Section>

        <Section id="v-assets" eyebrow="Chapter V" title="Assets of the Association">
          <Art n="24" title="Assets">
            The assets of the Association consist of fees from service providers,
            Membership fees, public or private grants or subsidies, any gifts,
            contributions and other sources permitted by law.
          </Art>
          <Art n="25" title="Liability">
            Only the Association&apos;s assets shall cover for the liabilities of the
            Association. The Member&apos;s or Management Board&apos;s personal liability for the
            liabilities of the Association is excluded.
          </Art>
          <Art n="26" title="Liquidation proceeds">
            In the event of the dissolution of the Association, the Management Board
            determines the distribution of the liquidation proceeds.
          </Art>
        </Section>

        <Section id="vi-dissolution" eyebrow="Chapter VI" title="Dissolution">
          <p className="text-text-secondary">
            The Association will be dissolved on the basis of a corresponding resolution.
            In addition, the Association is automatically dissolved if only one Member
            remains and no second Member joins within three months.
          </p>
        </Section>

        <div className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
          <SignatureBlock name="Ali Mizani Oskui" date="7 November 2025" role="Chairman" />
          <SignatureBlock name="Martin Liebi" date="7 November 2025" role="Board Member" />
        </div>

        <p className="mt-10 text-xs text-text-muted">
          This page is a faithful, human-readable reproduction of the Articles of
          Association dated 7 November 2025. In case of any inconsistency, the signed
          original lodged with the Handelsregisteramt des Kantons Zug prevails.
        </p>
      </article>

      <Footer />
    </div>
  );
}

function TOC() {
  const items = [
    { id: 'i-general', label: 'General Provisions', icon: <FileText className="h-4 w-4" /> },
    { id: 'ii-membership', label: 'Membership', icon: <Users2 className="h-4 w-4" /> },
    { id: 'iii-org', label: 'Organisation', icon: <Landmark className="h-4 w-4" /> },
    { id: 'iv-audit', label: 'Audit', icon: <Scale className="h-4 w-4" /> },
    { id: 'v-assets', label: 'Assets', icon: <FileText className="h-4 w-4" /> },
    { id: 'vi-dissolution', label: 'Dissolution', icon: <FileText className="h-4 w-4" /> },
  ];
  return (
    <nav className="mb-16 card">
      <p className="eyebrow">Contents</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-sm text-text-secondary transition hover:border-primary/40 hover:text-text-emphasis"
            >
              <span className="flex items-center gap-2">
                {i.icon}
                {i.label}
              </span>
              <span className="text-text-muted">→</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-8 space-y-10 text-[15px] leading-[1.75] text-text-secondary">
        {children}
      </div>
    </section>
  );
}

function Art({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-8 sm:pl-12">
      <span className="absolute left-0 top-0 font-mono text-xs tracking-[0.15em] text-primary-light">
        ART. {n}
      </span>
      <h3 className="mb-3 mt-1 text-base font-semibold uppercase tracking-[0.15em] text-text-emphasis">
        {title}
      </h3>
      <div className="space-y-3 [&>p]:text-text-secondary">{children}</div>
    </div>
  );
}

function SignatureBlock({
  name,
  role,
  date,
}: {
  name: string;
  role: string;
  date: string;
}) {
  return (
    <div className="card">
      <p className="font-mono text-xs tracking-[0.22em] text-text-muted">SIGNED</p>
      <p className="mt-3 font-display text-2xl text-text-emphasis">{name}</p>
      <p className="text-sm text-primary-light">{role}</p>
      <div className="my-4 divider-glow" />
      <p className="text-xs text-text-muted">Date · {date} · Zug, Switzerland</p>
    </div>
  );
}
