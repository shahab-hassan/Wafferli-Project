const nodemailer = require("nodemailer");
const { Verification_Email_Template } = require("./emailTemplates");

const sendVerificationCode = async (email, verificationCode) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Wafferli" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });

  } catch (error) {
    console.log(" Error sending verification code:", error);
  }
};


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASS,
    },
  });

  const mailOptions = {
    from: `"Wafferli" <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    html: options.text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Email could not be sent");
  }
};


module.exports = { sendVerificationCode, sendEmail };
