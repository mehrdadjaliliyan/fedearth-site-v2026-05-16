'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SplitHeading({
  text,
  className,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = Tag as any;
    return <Plain className={className}>{text}</Plain>;
  }

  const Wrapper = Tag as any;
  const words = text.split(' ');

  return (
    <Wrapper className={className}>
      <motion.span
        initial="hidden"
        animate="show"
        variants={container}
        style={{ display: 'inline-flex', flexWrap: 'wrap', overflow: 'visible' }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              paddingBottom: '0.15em',
              marginRight: '0.28em',
              lineHeight: 'inherit',
            }}
          >
            <motion.span variants={word} style={{ display: 'inline-block' }}>
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
}

export function SplitHeadingChildren({
  children,
  className,
  as: Tag = 'h1',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const reduce = useReducedMotion();
  const Wrapper = Tag as any;
  if (reduce) return <Wrapper className={className}>{children}</Wrapper>;
  return (
    <Wrapper className={className}>
      <motion.span
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </Wrapper>
  );
}
