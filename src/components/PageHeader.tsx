'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitHeading from '@/components/motion/SplitHeading';

export default function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 aurora-soft" />
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <motion.div
          initial={reduce ? false : { x: -8, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-emphasis transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </motion.div>

        <motion.p
          initial={reduce ? false : { y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          {eyebrow}
        </motion.p>

        <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-balance">
          <SplitHeading text={title} as="span" />
          {accent && (
            <>
              {' '}
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduce ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block italic grad-text"
                >
                  {accent}
                </motion.span>
              </span>
            </>
          )}
        </h1>

        {intro && (
          <motion.p
            initial={reduce ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-3xl text-lg leading-relaxed text-text-secondary"
          >
            {intro}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={reduce ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
