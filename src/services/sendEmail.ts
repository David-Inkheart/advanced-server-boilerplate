import nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (recipientEmail: string, url: string ) => {
  const info = await transporter.sendMail({
    from: `"advanced-server-boilerplate" <${process.env.EMAIL}>`, // sender address
    to: recipientEmail, // list of receivers
    subject: "Email Confirmation Link", // Subject line
    // very nice trick to make the url look like a button
    html:
      `<html>
        <body>
          <div style="text-align: center;">
            <h2>Welcome! ${recipientEmail}</h2>
            <p>Click the button below to confirm your email address</p>
            <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a>
          </div>
        </body>
      </html>`,
    // text: url, // plain text body
  });
  console.log("Message sent: %s", info);
  return info;
};