import { env } from "../config/env";

type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

const buildLink = (path: string, token: string) => {
  const base = env.appBaseUrl.replace(/\/$/, "");
  return `${base}${path}?token=${token}`;
};

export const emailTemplates = {
  verifyEmail: (token: string): EmailTemplate => {
    const link = buildLink("/verify-email", token);
    return {
      subject: "Verify your email",
      text: `Verify your email using this link: ${link}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email address.</p>
          <p><a href="${link}" style="background:#ff3f92;color:#0b0c12;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Verify email</a></p>
          <p>If the button does not work, paste this link in your browser:</p>
          <p>${link}</p>
        </div>
      `,
    };
  },
  resetPassword: (token: string): EmailTemplate => {
    const link = buildLink("/reset-password", token);
    return {
      subject: "Reset your password",
      text: `Reset your password using this link: ${link}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Reset your password</h2>
          <p>Click the button below to reset your password.</p>
          <p><a href="${link}" style="background:#725eff;color:#0b0c12;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Reset password</a></p>
          <p>If the button does not work, paste this link in your browser:</p>
          <p>${link}</p>
        </div>
      `,
    };
  },
};
