const nodemailer = require("nodemailer");

const MailSender = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "salimangesh16@gmail.com",
        pass: "melglcmmwqesuaxu",
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
