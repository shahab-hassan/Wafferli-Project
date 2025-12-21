const Verification_Email_Template = `
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);overflow:hidden;border:1px solid #ddd;">
    <div style="background-color:#4CAF50;color:white;padding:20px;text-align:center;font-size:26px;font-weight:bold;">
      Verify Your Email
    </div>
    <div style="padding:25px;color:#333;line-height:1.8;font-family:Arial,sans-serif;">
      <p>Hello,</p>
      <p>Please confirm your email address by entering the code below:</p>
      <div style="margin:20px 0;font-size:22px;color:#4CAF50;background:#e8f5e9;border:1px dashed #4CAF50;padding:10px;text-align:center;border-radius:5px;font-weight:bold;letter-spacing:2px;">
        {verificationCode}
      </div>
      <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
    </div>
    <div style="background-color:#f4f4f4;padding:15px;text-align:center;color:#777;font-size:12px;border-top:1px solid #ddd;">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
`;


const newEmployeeAdded = ({ name, email, role, access, password, loginLink }) => {
  return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center;">Welcome to Wafferli Admin Panel</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Hello ${name},<br><br>
                    You have been added as an admin in Wafferli. Below are your account details:
                </p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                    ${role === 'Moderator' ? `
                        <p style="color: #333; font-size: 14px; margin: 5px 0;">
                            <strong>Access to Pages:</strong> ${Object.keys(access).join(', ')}
                        </p>
                    ` : ''}
                    <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                </div>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    You can now log in to the admin panel using the button below:
                </p>
                <div style="text-align: center;">
                    <a href="${loginLink}" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #4CAF50; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">Access Admin Panel</a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                    If you have any questions or need assistance, feel free to contact our support team. Thank you for being part of Wafferli!
                </p>
            </div>
        </div>
    `;
};

module.exports = {
  Verification_Email_Template,
  newEmployeeAdded
};
