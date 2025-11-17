const nodemailer = require("nodemailer");
const { Verification_Email_Template } = require("./emailTempletes");

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

const sendVerificationCode = async (email, verificationCode) => {
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

    console.log("Verification email sent successfully!");
  } catch (error) {
    console.log(" Error sending verification code:", error);
  }
};

module.exports = { sendVerificationCode };
