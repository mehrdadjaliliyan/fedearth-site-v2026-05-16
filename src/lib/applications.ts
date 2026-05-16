export type ApplicationKind =
  | 'member'
  | 'newsletter'
  | 'contact'
  | 'partner'
  | 'donor';

export type ApplicationPayload = {
  kind: ApplicationKind;
  fullName?: string;
  email: string;
  reason?: string;
  message?: string;
  consent?: boolean;
  metadata?: Record<string, unknown>;
};

export type ApplicationResult = {
  ok: boolean;
  transport: 'smtp' | 'mailto';
  message: string;
  mailto?: { to: string; subject: string; body: string };
};

const ORG_EMAIL = 'contact@fedearth.org';

export function buildMailtoUrl(
  payload: ApplicationPayload,
  fallback?: { to: string; subject: string; body: string },
): string {
  const to = fallback?.to ?? ORG_EMAIL;
  const subject = fallback?.subject ?? defaultSubject(payload);
  const body = fallback?.body ?? defaultBody(payload);
  const qs = new URLSearchParams({ subject, body }).toString();
  return `mailto:${to}?${qs}`;
}

function defaultSubject(p: ApplicationPayload) {
  const name = p.fullName ?? '(no name supplied)';
  switch (p.kind) {
    case 'member':
      return `New membership application · ${name}`;
    case 'newsletter':
      return `Newsletter subscription · ${p.email}`;
    case 'contact':
      return `Contact form · ${name}`;
    case 'partner':
      return `Partnership enquiry · ${name}`;
    case 'donor':
      return `Donor enquiry · ${name}`;
  }
}

function defaultBody(p: ApplicationPayload) {
  return [
    `Kind: ${p.kind}`,
    `Name: ${p.fullName ?? '(no name supplied)'}`,
    `Email: ${p.email}`,
    p.reason ? `Reason: ${p.reason}` : null,
    p.message ? `Message:\n${p.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function submitApplication(
  payload: ApplicationPayload,
): Promise<ApplicationResult> {
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as ApplicationResult;
    if (!res.ok || !data.ok) {
      // Treat API failure same as mailto fallback so the user is never blocked.
      return {
        ok: true,
        transport: 'mailto',
        message: 'Open your email app to complete sending the message.',
      };
    }
    return data;
  } catch {
    return {
      ok: true,
      transport: 'mailto',
      message: 'Open your email app to complete sending the message.',
    };
  }
}
