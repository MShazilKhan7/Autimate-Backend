import { transporter } from "./Email.config.js";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./EmailTemplate.js";

export const sendVerificationEmail = async (email, verificationCode, verificationLink) => {
  try {
    const htmlContent = Verification_Email_Template
      .replace("{verificationCode}", verificationCode)
      .replace("{verificationLink}", verificationLink);

    await transporter.sendMail({
      from: '"FYP-Autimate" <autimate2245@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: '"FYP-Autimate" <autimate2245@gmail.com>',
      to: email,
      subject: "Welcome Email",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name),
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};
