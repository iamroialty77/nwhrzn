import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const CONTACT_INBOX = "roi@nwhrzn.digital";
const MAX_FIELD_LENGTH = 2000;
const MAX_MESSAGE_LENGTH = 10000;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

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

const toSafeMessage = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .slice(0, MAX_MESSAGE_LENGTH);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toSafeFilename = (value: string) =>
  value
    .trim()
    .replaceAll(/[^\w.\-() ]/g, "_")
    .slice(0, 180) || "attachment";

const isAllowedAttachment = (file: File) => {
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  const byMime = mime === "application/pdf" || mime.startsWith("image/");
  const byExt = /\.(pdf|png|jpe?g|webp|gif|bmp|svg)$/i.test(name);
  return byMime || byExt;
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let rawName: unknown = "";
  let rawEmail: unknown = "";
  let rawMessage: unknown = "";
  let attachment: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData().catch(() => null);
    rawName = formData?.get("name");
    rawEmail = formData?.get("email");
    rawMessage = formData?.get("message");
    const maybeAttachment = formData?.get("attachment");
    if (maybeAttachment instanceof File && maybeAttachment.size > 0) {
      attachment = maybeAttachment;
    }
  } else {
    const payload = (await request.json().catch(() => null)) as ContactPayload | null;
    rawName = payload?.name;
    rawEmail = payload?.email;
    rawMessage = payload?.message;
  }

  const name = toSafeText(rawName);
  const email = toSafeText(rawEmail);
  const message = toSafeMessage(rawMessage);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (attachment) {
    if (attachment.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: "Attachment is too large. Max size is 10MB." }, { status: 400 });
    }
    if (!isAllowedAttachment(attachment)) {
      return NextResponse.json({ error: "Only PDF and image files are allowed." }, { status: 400 });
    }
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

    const attachments = attachment
      ? [
          {
            filename: toSafeFilename(attachment.name),
            content: Buffer.from(await attachment.arrayBuffer()),
            contentType: attachment.type || undefined,
          },
        ]
      : undefined;

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const escapedAttachmentName = attachment ? escapeHtml(toSafeFilename(attachment.name)) : null;

    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n${attachment ? `Attachment: ${toSafeFilename(attachment.name)}\n` : ""}\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${escapedName}</p><p><strong>Email:</strong> ${escapedEmail}</p>${
        escapedAttachmentName ? `<p><strong>Attachment:</strong> ${escapedAttachmentName}</p>` : ""
      }<p><strong>Message:</strong></p><p>${escapedMessage}</p>`,
      attachments,
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
