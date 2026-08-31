import { BrevoClient } from "@getbrevo/brevo";

let brevo;

const getBrevoClient = () => {
  if (!brevo) {
    brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  }
  return brevo;
};

export const sendEmail = async (email, name, activationURL) => {
  const result = await getBrevoClient().transactionalEmails.sendTransacEmail({
    subject: "Activation Email",
    htmlContent: `<h2>Hi ${name}, please click here to activate your account:</h2>
                  <a href="${activationURL}">${activationURL}</a>`,
    sender: {
      name: "E-shop",
      email: "biyaamir977@gmail.com",
    },
    to: [
      {
        email,
        name,
      },
    ],
  });

  console.log("Email sent:", result.messageId);
};

export const sendResetPasswordEmail = async (email, name, resetURL) => {
  const result = await getBrevoClient().transactionalEmails.sendTransacEmail({
    subject: "Reset Your Password",
    htmlContent: `<h2>Hi ${name}, click the link below to reset your password:</h2>
                  <a href="${resetURL}">${resetURL}</a>
                  <p>This link expires in 15 minutes. If you did not request a password reset, please ignore this email.</p>`,
    sender: {
      name: "E-shop",
      email: "biyaamir977@gmail.com",
    },
    to: [
      {
        email,
        name,
      },
    ],
  });

  console.log("Email sent:", result.messageId);
};