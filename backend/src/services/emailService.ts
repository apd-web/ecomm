import { Resend } from "resend";

import { env } from "../config/env";

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export const emailService = {
  send: async (payload: EmailPayload) => {
    if (!resend) {
      if (env.nodeEnv !== "production") {
        console.log(`[email] to=${payload.to} subject=${payload.subject} text=${payload.text}`);
      }
      return;
    }

    await resend.emails.send({
      from: env.emailFrom,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  },
};
