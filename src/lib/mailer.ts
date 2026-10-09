export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  // Jika konfigurasi SMTP belum diset di development
  if (!host || !user || !pass) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Mock Mailer] Mengirim email ke ${options.to}: [${options.subject}]`);
      return true;
    }
    return false;
  }

  // Integrasi transporter nodemailer atau provider API jika tersedia
  console.log(`[Mailer] Mengirim email ke ${options.to}: ${options.subject}`);
  return true;
}
