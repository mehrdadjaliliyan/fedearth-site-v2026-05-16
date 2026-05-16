'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const colVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-ink-950/80">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <motion.div
            className="md:col-span-5"
            variants={colVariants}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-80 blur" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 ring-1 ring-primary/40">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-light" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3c3 3.5 4.5 6 4.5 9s-1.5 5.5-4.5 9c-3-3.5-4.5-6-4.5-9S9 6.5 12 3z" />
                  </svg>
                </span>
              </div>
              <div>
                <p className="font-display text-xl text-text-emphasis">Federation of Earth</p>
                <p className="text-xs uppercase tracking-[0.22em] text-text-muted">fedearth · Swiss NGO</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
              A Swiss non-profit association advancing the tools and concepts of direct
              democracy worldwide — non-partisan, non-denominational, and built in the open.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip chip-primary">Art. 60 ZGB</span>
              <span className="chip chip-accent">Non-profit</span>
              <span className="chip chip-sky">On-chain native</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/[0.03] px-3 py-1.5 text-[11px] text-text-muted">
              <span className="font-mono tracking-wider">EN</span>
              <span className="h-3 w-px bg-border-strong" />
              <span className="font-mono tracking-wider opacity-60">DE · coming soon</span>
              <span className="h-3 w-px bg-border-strong" />
              <span className="font-mono tracking-wider opacity-60">FR · coming soon</span>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            variants={colVariants}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="eyebrow">Learn</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#mandate" className="muted hover:text-text-emphasis transition underline-sweep">Mandate</Link></li>
              <li><Link href="/impact" className="muted hover:text-text-emphasis transition underline-sweep">Programs</Link></li>
              <li><Link href="/#governance" className="muted hover:text-text-emphasis transition underline-sweep">Governance</Link></li>
              <li><Link href="/#leadership" className="muted hover:text-text-emphasis transition underline-sweep">Leadership</Link></li>
            </ul>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            variants={colVariants}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="eyebrow">Act</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/auth/register" className="muted hover:text-text-emphasis transition underline-sweep">Become a member</Link></li>
              <li><Link href="/join" className="muted hover:text-text-emphasis transition underline-sweep">Volunteer</Link></li>
              <li><Link href="/contact" className="muted hover:text-text-emphasis transition underline-sweep">Contact</Link></li>
              <li><Link href="/links" className="muted hover:text-text-emphasis transition underline-sweep">Links</Link></li>
            </ul>
          </motion.div>

          <motion.div
            className="md:col-span-3"
            variants={colVariants}
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="eyebrow">Registered Office</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-text-secondary">
              Federation of earth (fedearth)<br />
              Gublerstrasse 24<br />
              6300 Zug, Switzerland
            </address>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              Verein · Art. 60 ZGB · registered with the Handelsregisteramt des
              Kantons Zug. Incorporated 7 November 2025.
            </p>
            <p className="mt-3 text-xs">
              <a
                href="mailto:contact@fedearth.org"
                className="font-mono text-sky-soft hover:text-white transition underline-sweep"
              >
                contact@fedearth.org
              </a>
            </p>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Federation of Earth. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal" className="hover:text-text-emphasis transition">Articles of Association</Link>
            <span className="h-3 w-px bg-border-strong" />
            <Link href="/transparency" className="hover:text-text-emphasis transition">Transparency</Link>
            <span className="h-3 w-px bg-border-strong" />
            <span className="font-mono tracking-wider">1 · 1 · 1 EARTH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
