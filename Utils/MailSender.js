const nodemailer = require("nodemailer");

require("dotenv").config();

const MailSender = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Social Bridge",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = MailSender;
