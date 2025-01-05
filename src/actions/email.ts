"use server";

import { Resend } from "resend";

import { EmailTemplate } from "@/components/Emailtemplate";

const { RSEND_API, RESEND_TO_EMAIL, RESEND_FROM_EMAIL } = process.env;

export async function sendEmail(data: { from_name: string; message: string; sender_email: string }) {
  if (!RSEND_API || !RESEND_TO_EMAIL || !RESEND_FROM_EMAIL) {
    return { error: "Failed to send email", status: 500 };
  }

  const resend = new Resend(RSEND_API);

  try {
    const resp = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: RESEND_TO_EMAIL,
      subject: "🎉New submission to your contact form!",
      html: "",
      react: EmailTemplate(data)
    });

    if (resp.error) {
      console.log(resp.error);
      return { error: "Failed to send email", status: 500 };
    }

    return { message: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to send email", status: 500 };
  }
}
