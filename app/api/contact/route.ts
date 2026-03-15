import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const CONTACT_INBOX = "roi@nwhrzn.digital";
const MAX_FIELD_LENGTH = 2000;

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hasEmailLikeValue = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

const toSafeText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replaceAll("\r", " ")
    .replaceAll("\n", " ")
    .slice(0, MAX_FIELD_LENGTH);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = toSafeText(payload?.name);
  const email = toSafeText(payload?.email);
  const message = toSafeText(payload?.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFromRaw = process.env.SMTP_FROM;

  if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Email service is not configured yet. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS." },
      { status: 500 }
    );
  }

  const smtpPort = Number.parseInt(smtpPortRaw, 10);
  if (!Number.isFinite(smtpPort)) {
    return NextResponse.json({ error: "SMTP_PORT must be a number." }, { status: 500 });
  }

  const smtpFrom = (smtpFromRaw && hasEmailLikeValue(smtpFromRaw) ? smtpFromRaw : smtpUser).trim();

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replaceAll(
        "\n",
        "<br />"
      )}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Contact email send failed:", error);
    const maybeError = error as { code?: string; message?: string };
    const errorCode = maybeError?.code ? String(maybeError.code) : "UNKNOWN";
    return NextResponse.json(
      { error: `Failed to send message. SMTP error: ${errorCode}.` },
      { status: 500 }
    );
  }
}
