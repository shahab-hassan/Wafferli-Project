exports.welcomeEmail = (userName) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px;">
                <h2 style="color: #333;">Welcome to Wafferli, ${userName}!</h2>
                <p style="color: #555;">We're excited to have you join our community.</p>
                <p style="color: #555;">We're here to help if you need any support. Feel free to contact us anytime.</p>
                <p style="color: #555;">Thank you for being a part of Wafferli, and we look forward to seeing you thrive!</p>
                <p style="color: #555;">Best regards,<br/>The Wafferli Team</p>
            </div>
        </div>
    `;
};