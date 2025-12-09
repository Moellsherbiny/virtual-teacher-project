
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendActivationEmail(email: string, token: string) {
  const link = `${process.env.NEXTAUTH_URL}/activate?token=${token}`;
  await resend.emails.send({
    from: "Virtual Teacher <onboarding@resend.dev>",
    to: email,
    subject: "Activate your account",
    html: `<p>Click the link to activate your account:</p>
           <a href="${link}">${link}</a>`,
  });
}
