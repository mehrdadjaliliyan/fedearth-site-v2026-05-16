import nodemailer, { Transporter } from 'nodemailer';

export interface MailEnvelope {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  SMTP_FROM,
} = process.env;

export const isMailerConfigured = Boolean(
  SMTP_HOST && SMTP_USER && SMTP_PASS,
);

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!isMailerConfigured) return null;
  if (cachedTransporter) return cachedTransporter;

  const port = Number(SMTP_PORT ?? 587);
  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === 'true' || port === 465,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! },
  });
  return cachedTransporter;
}

export async function sendMail(envelope: MailEnvelope): Promise<{
  ok: boolean;
  transport: 'smtp' | 'dev-log';
  messageId?: string;
}> {
  const transporter = getTransporter();
  const from = SMTP_FROM ?? 'Federation of Earth <no-reply@fedearth.org>';

  if (!transporter) {
    console.log('\n───────── 📧  EMAIL PENDING (SMTP not configured) ─────────');
    console.log(`FROM: ${from}`);
    console.log(`TO:   ${envelope.to}`);
    console.log(`SUBJ: ${envelope.subject}`);
    if (envelope.replyTo) console.log(`REPLY-TO: ${envelope.replyTo}`);
    console.log('──────────── body (text) ────────────');
    console.log(envelope.text);
    console.log('─────────────────────────────────────\n');
    return { ok: true, transport: 'dev-log' };
  }

  const info = await transporter.sendMail({
    from,
    to: envelope.to,
    subject: envelope.subject,
    text: envelope.text,
    html: envelope.html,
    replyTo: envelope.replyTo,
  });
  return { ok: true, transport: 'smtp', messageId: info.messageId };
}
