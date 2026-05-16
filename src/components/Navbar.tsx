'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, User, Bell, Menu, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Magnetic from '@/components/motion/Magnetic';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const publicLinks = [
    { href: '/#mandate', label: 'Mandate' },
    { href: '/impact', label: 'Programs' },
    { href: '/#governance', label: 'Governance' },
    { href: '/transparency', label: 'Transparency' },
    { href: '/links', label: 'Links' },
  ];

  const appLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/communities', label: 'Communities' },
    { href: '/proposals', label: 'Proposals' },
  ];

  const links = user ? appLinks : publicLinks;

  return (
    <motion.header
      initial={reduce ? false : { y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'border-b border-border/60 bg-ink-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-ink-900/50'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Logo />
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-text-emphasis transition group-hover:text-white">
              Federation of Earth
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-text-muted sm:block">
              est. Zug · 2025
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={reduce ? false : { y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={link.href} className="nav-link underline-sweep relative py-1">
                {link.label}
              </Link>
            </motion.div>
          ))}
          {user?.role === 'admin' && (
            <Link href="/admin" className="nav-link underline-sweep">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/notifications"
                className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-emphasis transition"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Link>
              <Link
                href="/profile"
                className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-emphasis transition"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-emphasis transition"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/contact" className="nav-link underline-sweep">
                Contact
              </Link>
              <Magnetic strength={0.25}>
                <Link href="/auth/register" className="btn btn-primary !px-4 !py-2 text-sm">
                  Become a Member
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-text-primary hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-ink-900/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-border">
                  <Link href="/auth/login" className="btn btn-secondary w-full">
                    Sign in
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary w-full">
                    Become a Member
                  </Link>
                </div>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Logo() {
  return (
    <motion.span
      whileHover={{ rotate: 6, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="relative flex h-9 w-9 items-center justify-center"
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent opacity-90 blur-[6px]" />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 ring-1 ring-primary/40">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-primary-light" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3 3.5 4.5 6 4.5 9s-1.5 5.5-4.5 9c-3-3.5-4.5-6-4.5-9S9 6.5 12 3z" />
        </svg>
      </span>
    </motion.span>
  );
}
