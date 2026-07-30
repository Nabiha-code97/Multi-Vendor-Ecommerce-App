import { BrevoClient } from "@getbrevo/brevo";

let brevo;

export const sendEmail = async (email, name, activationURL) => {
  if (!brevo) {
    brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  }

  const result = await brevo.transactionalEmails.sendTransacEmail({
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