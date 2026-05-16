import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sendMail } from '@/lib/mailer';

const INBOX =
  process.env.APPLICATIONS_INBOX ??
  process.env.NEXT_PUBLIC_APPLICATIONS_INBOX ??
  'contact@fedearth.org';

const APPLICATIONS_LOG = path.join(process.cwd(), '.applications.jsonl');

interface ApplicationBody {
  fullName?: string;
  email?: string;
  reason?: string;
  consent?: boolean;
  kind?: 'member' | 'newsletter' | 'contact' | 'partner' | 'donor';
  message?: string;
  metadata?: Record<string, unknown>;
}

function escape(html: string) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  let body: ApplicationBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const { fullName, email, reason, kind = 'member', message } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { ok: false, error: 'valid email required' },
      { status: 400 },
    );
  }

  const record = {
    ...body,
    kind,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? null,
    ip:
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      null,
  };

  // Best-effort local log. On read-only filesystems (Vercel, Netlify, etc.)
  // this silently fails — that's fine, SMTP/mailto are the real delivery paths.
  try {
    await fs.appendFile(APPLICATIONS_LOG, JSON.stringify(record) + '\n', 'utf8');
  } catch {
    /* expected on serverless hosts */
  }

  const displayName = fullName ?? '(no name supplied)';
  const subject =
    kind === 'member'
      ? `New membership application · ${displayName}`
      : kind === 'newsletter'
      ? `Newsletter subscription · ${email}`
      : kind === 'contact'
      ? `Contact form · ${displayName}`
      : kind === 'partner'
      ? `Partnership enquiry · ${displayName}`
      : `Donor enquiry · ${displayName}`;

  const text = [
    `Kind: ${kind}`,
    `Name: ${displayName}`,
    `Email: ${email}`,
    reason ? `Reason: ${reason}` : null,
    message ? `Message:\n${message}` : null,
    `Received: ${record.receivedAt}`,
    `IP: ${record.ip ?? 'unknown'}`,
    '',
    'Federation of Earth · fedearth',
    'Gublerstrasse 24, 6300 Zug, Switzerland',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: 'Inter', system-ui, sans-serif; background:#05070D; color:#D7DBEA; padding:24px; max-width:560px;">
      <div style="border:1px solid #1F2440; border-radius:16px; padding:24px; background:#0F1220;">
        <p style="font-family:'Fraunces', Georgia, serif; font-size:22px; margin:0 0 4px; color:#fff;">Federation of Earth</p>
        <p style="font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:#8B92B0; margin:0 0 20px;">New ${escape(kind)}</p>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:6px 0; color:#8B92B0; width:120px;">Name</td><td style="color:#fff;">${escape(displayName)}</td></tr>
          <tr><td style="padding:6px 0; color:#8B92B0;">Email</td><td><a href="mailto:${escape(email)}" style="color:#A5B4FC;">${escape(email)}</a></td></tr>
          ${reason ? `<tr><td style="padding:6px 0; color:#8B92B0; vertical-align:top;">Reason</td><td style="color:#D7DBEA; white-space:pre-wrap;">${escape(reason)}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:6px 0; color:#8B92B0; vertical-align:top;">Message</td><td style="color:#D7DBEA; white-space:pre-wrap;">${escape(message)}</td></tr>` : ''}
          <tr><td style="padding:6px 0; color:#8B92B0;">Received</td><td style="color:#D7DBEA;">${record.receivedAt}</td></tr>
        </table>
      </div>
      <p style="font-size:11px; color:#5A6088; margin-top:16px; letter-spacing:.1em;">
        FEDERATION OF EARTH · fedearth · Gublerstrasse 24, 6300 Zug, Switzerland
      </p>
    </div>
  `;

  try {
    const result = await sendMail({
      to: INBOX,
      subject,
      text,
      html,
      replyTo: email,
    });

    if (result.transport === 'smtp') {
      return NextResponse.json({
        ok: true,
        transport: 'smtp',
        message: 'Application received. A confirmation email has been sent.',
      });
    }

    // SMTP not configured — return a structured mailto fallback the client
    // can open in the user's mail app so the message still reaches the inbox.
    return NextResponse.json({
      ok: true,
      transport: 'mailto',
      message: 'Open your email app to complete sending the message.',
      mailto: {
        to: INBOX,
        subject,
        body: text,
      },
    });
  } catch (err: any) {
    console.error('Failed to send application email:', err);
    return NextResponse.json(
      {
        ok: true,
        transport: 'mailto',
        message: 'Open your email app to complete sending the message.',
        mailto: {
          to: INBOX,
          subject,
          body: text,
        },
      },
      { status: 200 },
    );
  }
}
