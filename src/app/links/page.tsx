'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Magnetic from '@/components/motion/Magnetic';

type SocialItem = {
  label: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
};

const SOCIALS: SocialItem[] = [
  {
    label: 'Instagram',
    handle: '@alimizanioskui',
    href: 'https://www.instagram.com/alimizanioskui/',
    icon: <Instagram className="h-5 w-5" />,
    accent: 'from-fuchsia-500/40 via-pink-500/30 to-orange-400/30',
  },
  {
    label: 'YouTube',
    handle: '@alimizani.official',
    href: 'https://www.youtube.com/@alimizani.official',
    icon: <Youtube className="h-5 w-5" />,
    accent: 'from-red-500/40 via-rose-500/30 to-red-600/30',
  },
  {
    label: 'LinkedIn',
    handle: 'ali-mizani-oskui',
    href: 'https://www.linkedin.com/in/ali-mizani-oskui/',
    icon: <Linkedin className="h-5 w-5" />,
    accent: 'from-sky-500/40 via-blue-500/30 to-indigo-500/30',
  },
  {
    label: 'X / Twitter',
    handle: '@AliMizaniOskui',
    href: 'https://x.com/AliMizaniOskui',
    icon: <XIcon className="h-5 w-5" />,
    accent: 'from-white/30 via-white/10 to-white/0',
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <PageHeader
        eyebrow="Connect"
        title="Follow"
        accent="the Chairman."
        intro="Personal accounts of Ali Mizani Oskui — Board President of the Federation of Earth."
      />

      <section className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 aurora-soft pointer-events-none" />

        <SectionHeader
          index="01"
          eyebrow="Personal Social Media"
          title="Ali Mizani Oskui"
          subtitle="Board President · Federation of Earth"
        />

        <ul className="relative mt-8 grid gap-3 sm:grid-cols-2">
          {SOCIALS.map((s, i) => (
            <SocialCard key={s.label} item={s} index={i} />
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-16 text-center text-[11px] text-text-muted"
        >
          Personal social accounts belong to Ali Mizani Oskui. Opinions expressed are personal
          unless explicitly endorsed by the Management Board.
        </motion.p>
      </section>

      <Footer />
    </div>
  );
}

/* ===== sub-components ===== */

function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-end justify-between gap-4 border-b border-border pb-4"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-light">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl text-text-emphasis sm:text-4xl">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      </div>
      <span className="font-display text-4xl leading-none text-text-muted/40 sm:text-5xl">
        {index}
      </span>
    </motion.div>
  );
}

function SocialCard({ item, index }: { item: SocialItem; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Magnetic strength={0.12}>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-surface/70 px-5 py-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-elevated"
        >
          <span
            className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${item.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60`}
            aria-hidden="true"
          />
          <span className="relative flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary-light transition group-hover:bg-primary/20 group-hover:text-white">
              {item.icon}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-base font-semibold text-text-emphasis">{item.label}</span>
              <span className="truncate font-mono text-xs text-text-muted">{item.handle}</span>
            </span>
          </span>
          <ArrowUpRight className="relative h-4 w-4 shrink-0 text-text-secondary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </a>
      </Magnetic>
    </motion.li>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2H21l-6.49 7.41L22 22h-6.844l-4.79-6.27L4.8 22H2l6.96-7.95L2 2h6.914l4.34 5.74L18.244 2zm-1.2 18h1.76L7.04 4H5.18l11.864 16z" />
    </svg>
  );
}
