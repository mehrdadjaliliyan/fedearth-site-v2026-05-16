'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  Vote,
  ShieldCheck,
  Scale,
  Globe2,
  Sparkles,
  Users2,
  FileSignature,
  Fingerprint,
  Landmark,
  Eye,
  Layers,
  BookOpen,
  Quote,
  HeartHandshake,
  GraduationCap,
  Megaphone,
  FlaskConical,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Globe from '@/components/Globe';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import Magnetic from '@/components/motion/Magnetic';
import SplitHeading from '@/components/motion/SplitHeading';
import { buildMailtoUrl, submitApplication } from '@/lib/applications';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 140]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, reduce ? 1 : 0.3]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, reduce ? 1 : 0.96]);
  const gridParallax = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -80]);
  const globeParallax = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -60]);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  if (user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ y: gridParallax }} className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 grain" />
        <CornerMarks />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28"
        >
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <motion.div
                initial={reduce ? false : { y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky" />
                </span>
                <span>Registered with Handelsregisteramt des Kantons Zug</span>
              </motion.div>

              <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.75rem)] leading-[1.02] tracking-tightest text-balance">
                <SplitHeading
                  text="Direct democracy,"
                  className="grad-text block"
                  as="span"
                />
                <span className="block overflow-hidden">
                  <motion.span
                    initial={reduce ? false : { y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block italic text-text-emphasis"
                  >
                    built for everyone.
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={reduce ? false : { y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary text-pretty"
              >
                Federation of Earth is a Swiss non-profit association developing the
                tools and concepts of direct democracy worldwide — transparent,
                non-partisan, and cryptographically verifiable. One member. One vote.
                One earth.
              </motion.p>

              <motion.div
                initial={reduce ? false : { y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Magnetic strength={0.25}>
                  <Link href="/auth/register" className="btn btn-primary">
                    Become a Member
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link href="/#mandate" className="btn btn-secondary">
                    Read our mandate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
              </motion.div>

              <motion.dl
                initial={reduce ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8"
              >
                <StatPill k="Nov 2025" l="Founded, Zug CH" />
                <StatPill k="1 : 1" l="Member to vote" />
                <StatPill k="0%" l="Profit-oriented" />
              </motion.dl>
            </div>

            <motion.div
              style={{ y: globeParallax }}
              className="relative lg:col-span-5"
            >
              <Globe size={520} />
            </motion.div>
          </div>
        </motion.div>

        <MarqueeStrip />
      </section>

      {/* ========== MANDATE ========== */}
      <section id="mandate" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal direction="up" className="lg:col-span-4">
            <p className="eyebrow">Our Mandate</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
              A charter, not a <em className="grad-text-indigo">product.</em>
            </h2>
            <p className="mt-5 text-text-secondary">
              Codified on 7 November 2025 in our Articles of Association and filed with
              the Swiss commercial registry, our purpose is permanent, public, and
              amendable only by the General Assembly of members.
            </p>
            <Link href="/legal" className="mt-6 inline-flex items-center gap-2 text-primary-light hover:text-white transition">
              Read the full Articles <BookOpen className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="lg:col-span-8">
            <Reveal direction="up" delay={0.1}>
              <figure className="card shimmer-border">
                <Quote className="h-8 w-8 text-primary-light/80" />
                <blockquote className="mt-4 font-display text-2xl leading-snug text-text-emphasis text-balance sm:text-3xl">
                  &ldquo;The purpose of the Association is to develop and support
                  technology for the creation of tools and concepts to
                  <span className="italic"> foster direct democracy worldwide.</span> The
                  Association may create and govern one or multiple proprietary or
                  non-proprietary technology tools.&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm text-text-muted">
                  <span className="h-px w-8 bg-border-strong" />
                  Article 3 · Articles of Association, Federation of Earth (fedearth)
                </figcaption>
              </figure>
            </Reveal>

            <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-3" staggerChildren={0.12}>
              <StaggerItem>
                <MandateCard
                  icon={<Scale className="h-5 w-5" />}
                  title="Non-partisan"
                  body="No party line, no religion, no commercial agenda."
                />
              </StaggerItem>
              <StaggerItem>
                <MandateCard
                  icon={<Landmark className="h-5 w-5" />}
                  title="Non-profit"
                  body="Swiss Verein under Art. 60 et seq. ZGB. No profit distribution."
                />
              </StaggerItem>
              <StaggerItem>
                <MandateCard
                  icon={<Fingerprint className="h-5 w-5" />}
                  title="On-chain native"
                  body="Members apply electronically on-chain; ballots are verifiable."
                />
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* ========== OUR WORK / PROGRAMS ========== */}
      <section id="programs" className="relative border-t border-border">
        <div className="absolute inset-0 aurora-soft" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Our Work</p>
                <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
                  Four programs. <span className="italic grad-text">One civic stack.</span>
                </h2>
                <p className="mt-4 text-text-secondary">
                  We are a non-profit NGO, not a company. Our work is organized into
                  four public programs — each a line item on how the Association
                  pursues its mandate under Article 3.
                </p>
              </div>
              <Magnetic strength={0.2}>
                <Link href="/impact" className="btn btn-outline">
                  See our impact <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2" staggerChildren={0.12}>
            <StaggerItem>
              <ProgramCard
                tag="Program 01"
                icon={<FlaskConical />}
                title="Research & Protocol Design"
                body="Field-independent study of direct-democracy mechanisms: signature thresholds, quorum rules, sortition, deliberative processes, and verifiable ballots. Public deliverables; open peer review."
                bullets={['Open working papers', 'Mechanism audits', 'Comparative studies']}
              />
            </StaggerItem>
            <StaggerItem>
              <ProgramCard
                tag="Program 02"
                icon={<Layers />}
                title="Open-Source Technology"
                body="We build and govern the reference implementation of the Federation platform — auditable code, reproducible builds, self-hostable deployments. Grants available for liquidity bootstrapping and R&D per Art. 3."
                bullets={['MIT / AGPL licensed', 'Self-hostable', 'Grant funded']}
              />
            </StaggerItem>
            <StaggerItem>
              <ProgramCard
                tag="Program 03"
                icon={<GraduationCap />}
                title="Civic Education"
                body="Training materials, facilitator guides, and community-led workshops for teaching direct-democratic practice — from municipal councils to global coordination."
                bullets={['Open curriculum', 'Facilitator network', 'Multilingual']}
              />
            </StaggerItem>
            <StaggerItem>
              <ProgramCard
                tag="Program 04"
                icon={<Megaphone />}
                title="Advocacy & Policy"
                body="Strictly non-partisan, non-denominational advocacy for procedural rights: privacy of the ballot, freedom of political expression, and the equal weight of every vote."
                bullets={['Non-partisan briefings', 'Coalition building', 'Standards work']}
              />
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* ========== GOVERNANCE ========== */}
      <section id="governance" className="relative border-y border-border bg-ink-950/60">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Governance</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
                Three bodies. <span className="italic grad-text-indigo">One supreme voter — you.</span>
              </h2>
              <p className="mt-4 text-text-secondary">
                The Association&apos;s structure is deliberately minimal. Every member
                holds one vote in the General Assembly, the supreme body of the
                federation.
              </p>
            </div>
          </Reveal>

          <StaggerGroup className="mt-16 grid gap-4 md:grid-cols-3" staggerChildren={0.14}>
            <StaggerItem>
              <BodyCard
                step="I"
                icon={<Users2 className="h-6 w-6" />}
                title="General Assembly"
                subtitle="Supreme body"
                body="Every member, one vote. Approves the financial statements, elects the Management Board, amends the articles, and sets the annual membership fee."
                bullets={[
                  'Meets annually, online or virtually',
                  'Extraordinary assembly triggerable by 1/5 of members',
                  'Agenda published 20 days in advance',
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <BodyCard
                step="II"
                icon={<Landmark className="h-6 w-6" />}
                title="Management Board"
                subtitle="Stewards, not rulers"
                body="Prepares General Assemblies, proposes amendments, adopts regulations, and manages admissions. Binds the Association only by joint signature of two."
                bullets={[
                  'Chairman presides over the Assembly',
                  'Reports annually on transparency & diversity',
                  'All powers flow from the Assembly',
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <BodyCard
                step="III"
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Auditors"
                subtitle="Triggered by scale"
                body="Independent external audit is mandatory once the association crosses Swiss thresholds — so financial oversight scales automatically with impact."
                bullets={[
                  'CHF 10M total assets',
                  'CHF 20M turnover',
                  '50 full-time staff (avg)',
                ]}
                muted
              />
            </StaggerItem>
          </StaggerGroup>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <div className="divider-glow w-2/3" />
              <p className="max-w-2xl text-sm text-text-muted">
                &ldquo;All Members shall be on equal footing.&rdquo; — Article 6, Articles of
                Association.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== PLATFORM ========== */}
      <section id="platform" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">The Platform</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
                The software layer for <span className="italic grad-text">legitimate consent.</span>
              </h2>
              <p className="mt-4 text-text-secondary">
                Built to Swiss-grade process standards and designed for communities of
                any scale — a neighbourhood, a city, or a planet.
              </p>
            </div>
            <Magnetic strength={0.2}>
              <Link href="/auth/register" className="btn btn-outline">
                Start using the platform <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <StaggerGroup
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          staggerChildren={0.08}
        >
          {[
            { icon: <FileSignature />, title: 'Popular Initiatives', body: 'Launch a proposal, gather signatures with a transparent threshold, and bring it to a community-wide vote within a fixed campaign window.' },
            { icon: <Vote />, title: 'Direct Voting', body: 'Binary and multi-choice ballots with real-time tallies, vote-integrity checks, and one vote per authenticated member — enforced.' },
            { icon: <Scale />, title: 'Referendums', body: 'Mandatory referendums for constitutional changes; facultative referendums when 3–5% of members challenge a representative decision.', highlight: true },
            { icon: <Globe2 />, title: 'Multi-tier Communities', body: 'Local, regional, and global scopes, each with its own membership, proposals, and audit trails — participate wherever you belong.' },
            { icon: <Eye />, title: 'Radical Transparency', body: 'Every proposal, vote, and administrative action is written to an immutable audit log. Aggregates public, individual votes private.' },
            { icon: <Layers />, title: 'Open Infrastructure', body: 'Next.js + Postgres + on-chain attestations. Self-hostable. The code of a democracy should be legible to the people it governs.' },
          ].map((f, i) => (
            <StaggerItem key={i}>
              <FeatureCard {...f} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ========== PRINCIPLES ========== */}
      <section className="relative border-y border-border bg-gradient-to-b from-ink-950 to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Inalienable</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
                Three rights that the <span className="italic grad-text-indigo">code refuses to compromise.</span>
              </h2>
            </div>
          </Reveal>

          <StaggerGroup className="mt-16 grid gap-6 md:grid-cols-3" staggerChildren={0.14}>
            <StaggerItem>
              <Principle
                number="01"
                title="Privacy"
                body="Your ballot is yours. Only the aggregate result is public. There is no surveillance of political participation — by design, not by policy."
              />
            </StaggerItem>
            <StaggerItem>
              <Principle
                number="02"
                title="Freedom of Expression"
                body="Moderation exists to stop harm, not unpopular opinion. Legitimate political speech is protected at the protocol layer."
              />
            </StaggerItem>
            <StaggerItem>
              <Principle
                number="03"
                title="Equality"
                body="One member, one vote. No weighted voting, no tiered classes, no shareholder logic. Art. 6 of the Articles: equal footing for all."
              />
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* ========== LEADERSHIP ========== */}
      <section id="leadership" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
              Accountable to the <span className="italic">Assembly.</span>
            </h2>
            <p className="mt-5 text-text-secondary">
              The Management Board stewards operations but cannot act alone. Binding
              the Association requires the joint signature of the Chairman and one
              other board member.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Founding signatories · 7 November 2025
            </div>
          </Reveal>

          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:col-span-8" staggerChildren={0.15}>
            <StaggerItem>
              <PersonCard
                name="Ali Mizani Oskui"
                role="Chairman"
                bio="Co-founder and Chairman of the Federation. Presides over the General Assembly and co-signs on behalf of the Association."
                initials="AM"
              />
            </StaggerItem>
            <StaggerItem>
              <PersonCard
                name="Martin Liebi"
                role="Board Member"
                bio="Co-founder and Member of the Management Board. Co-signatory for the Association, based in Zug, Switzerland."
                initials="ML"
              />
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* ========== WAYS TO SUPPORT ========== */}
      <section id="support" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Get Involved</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
              Three ways to <span className="italic grad-text-indigo">stand with us.</span>
            </h2>
            <p className="mt-4 text-text-secondary">
              A direct-democracy infrastructure is built by the people it serves. Pick
              the contribution that fits you today.
            </p>
          </div>
        </Reveal>

        <StaggerGroup className="mt-16 grid gap-5 md:grid-cols-3" staggerChildren={0.1}>
          {[
            { icon: <Users2 />, title: 'Become a Member', body: 'One member, one vote in the General Assembly. Apply electronically under Art. 6.', cta: 'Apply', href: '/auth/register', highlight: true },
            { icon: <HeartHandshake />, title: 'Volunteer', body: 'Translation, research, facilitation, engineering — open ways to contribute.', cta: 'Join', href: '/join' },
            { icon: <Sparkles />, title: 'Partner', body: 'Municipalities, universities, and civic orgs: co-design pilots with us.', cta: 'Contact', href: '/contact' },
          ].map((s, i) => (
            <StaggerItem key={i}>
              <SupportCard {...s} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ========== PATH TO MEMBERSHIP ========== */}
      <section className="relative border-t border-border bg-ink-950/60">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
                Three steps to <span className="italic grad-text">equal footing.</span>
              </h2>
              <p className="mt-4 text-text-secondary">
                From application to first ballot — the process is electronic,
                non-discretionary, and governed by the Articles of Association.
              </p>
            </div>
          </Reveal>

          <StaggerGroup className="mt-16 grid gap-6 md:grid-cols-3" staggerChildren={0.18}>
            <StaggerItem>
              <Step n="01" label="Apply electronically" body="Register with your credentials. Membership is extended on a good-repute basis, recorded on-chain per Art. 6 of the Articles." />
            </StaggerItem>
            <StaggerItem>
              <Step n="02" label="Join a community" body="Pick your tier — local, regional, or global. Your vote weight is identical everywhere: one member, one vote." />
            </StaggerItem>
            <StaggerItem>
              <Step n="03" label="Vote, initiate, refer" body="Cast ballots, launch popular initiatives with signature thresholds, or trigger facultative referendums with 3–5% of members." />
            </StaggerItem>
          </StaggerGroup>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-col items-center gap-4 text-center text-xs text-text-muted">
              <div className="divider-glow w-2/3" />
              <p className="font-mono tracking-[0.3em]">
                FOUNDED · 07 · 11 · 2025 · ZUG · CH · VEREIN · ART. 60 ZGB
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Newsletter />

      {/* ========== MEMBERSHIP CTA ========== */}
      <section className="relative overflow-hidden border-y border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 aurora-soft" />
        <div className="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-6">
          <Reveal>
            <p className="eyebrow">Membership</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-balance">
              The work of democracy is done by <span className="italic grad-text">the citizens of it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary text-pretty">
              Membership is open to those who are trustworthy and of good repute, on
              equal footing with every other member. Apply electronically — no
              gatekeepers, no classes, one vote each.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.25}>
                <Link href="/auth/register" className="btn btn-accent">
                  Apply for Membership
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/legal" className="btn btn-secondary">
                  Review the Articles
                </Link>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 text-xs text-text-muted">
              By applying you acknowledge the Articles of Association and the equal
              footing of all members.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ===== atoms ===== */

function StatPill({ k, l }: { k: string; l: string }) {
  return (
    <div>
      <dt className="font-display text-2xl text-text-emphasis sm:text-3xl">{k}</dt>
      <dd className="mt-1 text-xs uppercase tracking-wider text-text-muted">{l}</dd>
    </div>
  );
}

function MandateCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card card-hover h-full"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-emphasis">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </motion.div>
  );
}

function BodyCard({
  step,
  icon,
  title,
  subtitle,
  body,
  bullets,
  muted,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  muted?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={[
        'card card-hover flex flex-col h-full',
        muted ? 'opacity-90' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div
          className={[
            'flex h-12 w-12 items-center justify-center rounded-xl',
            muted
              ? 'border border-border-strong bg-white/[0.02] text-text-secondary'
              : 'border border-primary/30 bg-primary/10 text-primary-light',
          ].join(' ')}
        >
          {icon}
        </div>
        <span className="font-display text-3xl text-text-muted">{step}</span>
      </div>
      <h3 className="mt-6 font-display text-2xl text-text-emphasis">{title}</h3>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-primary-light">
        {subtitle}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{body}</p>
      <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-text-secondary">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-primary-light" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={[
        'card card-hover h-full',
        highlight ? 'shimmer-border' : '',
      ].join(' ')}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-text-emphasis">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </motion.div>
  );
}

function Principle({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative h-full"
    >
      <div className="card h-full card-hover">
        <p className="font-mono text-xs tracking-[0.28em] text-primary-light">
          PRINCIPLE · {number}
        </p>
        <h3 className="mt-4 font-display text-3xl text-text-emphasis">{title}</h3>
        <div className="my-5 divider-glow" />
        <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
      </div>
    </motion.div>
  );
}

function PersonCard({
  name,
  role,
  bio,
  initials,
}: {
  name: string;
  role: string;
  bio: string;
  initials: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card card-hover h-full"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-80 blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 ring-1 ring-primary/40 font-display text-lg text-text-emphasis">
            {initials}
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-emphasis">{name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-light">{role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-text-secondary">{bio}</p>
    </motion.div>
  );
}

function ProgramCard({
  tag,
  icon,
  title,
  body,
  bullets,
}: {
  tag: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="card card-hover relative overflow-hidden h-full group"
    >
      <motion.div
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        initial={{ scale: 0.9, opacity: 0.5 }}
        whileHover={{ scale: 1.3, opacity: 0.9 }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
            {tag}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </div>
        </div>
        <h3 className="mt-6 font-display text-2xl text-text-emphasis">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
        <div className="my-5 divider-glow" />
        <ul className="flex flex-wrap gap-2">
          {bullets.map((b) => (
            <li key={b} className="chip">{b}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function SupportCard({
  icon,
  title,
  body,
  cta,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link
        href={href}
        className={[
          'card card-hover group flex h-full flex-col justify-between',
          highlight ? 'shimmer-border' : '',
        ].join(' ')}
      >
        <div>
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
          <h3 className="mt-5 text-lg font-semibold text-text-emphasis">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-light transition group-hover:text-white">
          {cta} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setState('err');
      setMsg('Please enter a valid email.');
      return;
    }
    setState('loading');
    const payload = {
      kind: 'newsletter' as const,
      email,
      metadata: { source: 'newsletter-inline' },
    };
    const result = await submitApplication(payload);
    if (result.transport === 'mailto') {
      const url = buildMailtoUrl(payload, result.mailto);
      if (typeof window !== 'undefined') window.location.href = url;
      setMsg('Almost done — finish sending from your email app.');
    } else {
      setMsg('Subscribed. Dispatches will arrive from contact@fedearth.org.');
    }
    setState('ok');
    setEmail('');
  };

  return (
    <section className="relative border-t border-border bg-ink-950/60">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal direction="up" className="lg:col-span-5">
          <p className="eyebrow">Dispatches</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
            Updates from <span className="italic grad-text-indigo">the Assembly floor.</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Quarterly letters from the Management Board — research notes, platform
            releases, governance proposals, and the minutes of the General Assembly.
            No spam, ever.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15} className="lg:col-span-7">
          <form onSubmit={submit} className="card card-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary-light">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-emphasis">Subscribe to the dispatch</p>
                <p className="text-xs text-text-muted">Delivered to your inbox, quarterly.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                className="input flex-1"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === 'loading'}
              />
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="btn btn-primary min-w-[150px] justify-center"
                  disabled={state === 'loading'}
                >
                  {state === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </Magnetic>
            </div>

            <AnimatePresence>
              {state === 'ok' && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-lg border border-sky/30 bg-sky/10 p-3 text-sm text-sky-soft"
                >
                  {msg}
                </motion.p>
              )}
              {state === 'err' && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {msg}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="mt-4 text-[11px] text-text-muted">
              By subscribing you agree to receive email from Federation of Earth. You
              can unsubscribe at any time.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Step({
  n,
  label,
  body,
}: {
  n: string;
  label: string;
  body: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card card-hover relative h-full"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-5xl leading-none text-primary-light">
          {n}
        </span>
        <span className="h-px flex-1 origin-right scale-x-0 bg-primary-light/40 transition-transform duration-500 group-hover:scale-x-100 ml-4" />
      </div>
      <h3 className="mt-6 font-display text-2xl text-text-emphasis">{label}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
    </motion.div>
  );
}

function CornerMarks() {
  const Mark = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <motion.svg
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      viewBox="0 0 24 24"
      fill="none"
      className={['pointer-events-none absolute h-6 w-6 text-primary/30', className].join(' ')}
      aria-hidden="true"
    >
      <path d="M3 10V3h7" stroke="currentColor" strokeWidth="1" />
      <path d="M21 14v7h-7" stroke="currentColor" strokeWidth="1" />
      <path d="M14 3h7v7" stroke="currentColor" strokeWidth="1" />
      <path d="M10 21H3v-7" stroke="currentColor" strokeWidth="1" />
    </motion.svg>
  );
  return (
    <>
      <Mark className="left-4 top-4 sm:left-8 sm:top-8" delay={0.2} />
      <Mark className="right-4 top-4 rotate-90 sm:right-8 sm:top-8" delay={0.35} />
      <Mark className="bottom-4 left-4 -rotate-90 sm:bottom-8 sm:left-8" delay={0.5} />
      <Mark className="bottom-4 right-4 rotate-180 sm:bottom-8 sm:right-8" delay={0.65} />
    </>
  );
}

function MarqueeStrip() {
  const items = [
    'Art. 60 ZGB',
    'Swiss Verein',
    'One Member · One Vote',
    'Non-partisan',
    'Non-denominational',
    'On-chain membership',
    'Zug, Switzerland',
    'Founded 7 · 11 · 2025',
  ];
  return (
    <div className="relative border-y border-border bg-ink-900/60">
      <div
        className="flex overflow-hidden py-4"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...items, ...items, ...items].map((it, i) => (
            <span
              key={i}
              className="mx-8 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted"
            >
              {it}
              <span className="ml-8 text-primary-light/60">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
