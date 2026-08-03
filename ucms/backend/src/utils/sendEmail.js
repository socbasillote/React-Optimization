import transporter from "../config/mail.js";

const sendEmail = async ({ to, subject, html, text }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

export default sendEmail;
