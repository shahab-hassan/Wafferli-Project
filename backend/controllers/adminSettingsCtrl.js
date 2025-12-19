// File: src/controllers/adminSettingsCtrl.js
const adminSettingsModel = require('../models/adminSettingsModel');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const sendEmail = require("../utils/sendEmail")
const { sendEmailFromAdminTemplate, receiveEmailFromUserTemplate, marketingEmailToSeller, marketingEmailToUsers } = require("../utils/emailTemplates")


exports.getTerms = asyncHandler(async (req, res) => {
    try {

        const settings = await adminSettingsModel.findOne({}, 'terms');

        if (!settings || !settings.terms) {
            res.status(404);
            throw new Error("Terms not found!");
        }

        res.status(200).json({ success: true, terms: settings.terms });

    } catch (err) {
        res.status(500);
        throw new Error(err);
    }
});

exports.createOrUpdateTerms = asyncHandler(async (req, res) => {

    const { content } = req.body;

    if (!content) {
        res.status(400);
        throw new Error("Content is required!");
    }

    let settings = await adminSettingsModel.findOne();

    if (settings) {
        settings.terms = content;
        settings = await settings.save();
    } else
        settings = await adminSettingsModel.create({ terms: content });

    res.status(200).json({
        success: true,
        terms: settings.terms
    });
});


exports.getSocialLinks = asyncHandler(async (req, res) => {
    const settings = await adminSettingsModel.findOne({}, 'socialLinks');

    res.status(200).json({ success: true, socialLinks: settings?.socialLinks });
});

exports.createOrUpdateSocialLinks = asyncHandler(async (req, res) => {
    const { socialLinks } = req.body;

    if (!socialLinks || Object.keys(socialLinks).length === 0) {
        res.status(400);
        throw new Error("At least one social link is required!");
    }

    let settings = await adminSettingsModel.findOne();

    if (settings) {
        settings.socialLinks = socialLinks;
        settings = await settings.save();
    } else {
        settings = await adminSettingsModel.create({ socialLinks });
    }

    res.status(200).json({ success: true, socialLinks: settings.socialLinks });
});


exports.receiveEmailFromUser = asyncHandler(async (req, res) => {

    await sendEmail({
        to: process.env.SMTP_FROM_EMAIL,
        subject: `New Contact Form Submission: ${req.body.subject}`,
        text: receiveEmailFromUserTemplate(req.body.fullName, req.body.email, req.body.country, req.body.phoneNumber, req.body.message),
    });

    res.status(200).json({ success: true });

});

exports.subscribeEmailByUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error("Email is required!");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: "You are already in our system! You'll receive our updates."
            });
        }

        let adminSettings = await adminSettingsModel.findOne({});
        if (!adminSettings) {
            adminSettings = await adminSettingsModel.create({
                terms: "Default terms"
            });
        }

        const alreadySubscribed = adminSettings.subscribedEmails.includes(email);
        if (alreadySubscribed) {
            return res.status(200).json({
                success: true,
                message: "Email already subscribed!"
            });
        }

        adminSettings.subscribedEmails.push(email);
        await adminSettings.save();

        res.status(200).json({
            success: true,
            message: "Subscribed Successfully!"
        });

    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
});

exports.getAllEmails = asyncHandler(async (req, res) => {
    try {
        const adminSettings = await adminSettingsModel.findOne({});
        const subscribedEmails = adminSettings?.subscribedEmails || [];

        // Optional: Add user emails if needed
        const userEmails = await User.find({}, 'email').lean();
        const userEmailList = userEmails.map(u => u.email);

        // Combine and remove duplicates
        // const allEmails = [...new Set([...subscribedEmails, ...userEmailList])];
        const allEmails = [...new Set([...subscribedEmails])];

        res.status(200).json({
            success: true,
            emails: allEmails.reverse() // Newest first
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

exports.sendEmailFromAdmin = asyncHandler(async (req, res) => {

    const { recipients, subject, message, buttons } = req.body;

    const { to = [], cc = [], bcc = [] } = recipients;

    if (to.length === 0 && cc.length === 0 && bcc.length === 0) {
        res.status(400);
        throw new Error("No recipients provided!");
    }

    let emailSubject, emailBody;

    if (subject.includes("Seller Marketing Template")) {
        emailSubject = "Start Selling Your Spiritual Services & Products on Faithzy!";
        emailBody = marketingEmailToSeller();
    } else if (subject.includes("Buyers & Sellers Template")) {
        emailSubject = "Discover Spiritual Services & Mystical Products on Faithzy!";
        emailBody = marketingEmailToUsers();
    } else {
        emailSubject = subject;
        emailBody = sendEmailFromAdminTemplate(subject, message, buttons)
    }

    const emailOptions = {
        subject: emailSubject,
        text: emailBody,
        to: to,
        cc: cc,
        bcc: bcc
    };

    try {
        await sendEmail(emailOptions);

        return res.status(200).json({
            success: true,
            message: `Email successfully sent!`,
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to send email: ${error.message}`);
    }

});

exports.deleteEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!"
            });
        }

        const adminSettings = await adminSettingsModel.findOne({});
        if (adminSettings) {
            adminSettings.subscribedEmails = adminSettings.subscribedEmails.filter(e => e !== email);
            await adminSettings.save();
        }

        res.status(200).json({
            success: true,
            message: "Email deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

exports.addEmails = asyncHandler(async (req, res) => {
    try {
        const { emails } = req.body;
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Valid emails array is required!"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = emails.filter(email => emailRegex.test(email));

        let adminSettings = await adminSettingsModel.findOne({});
        if (!adminSettings) {
            adminSettings = await adminSettingsModel.create({
                terms: "Default terms"
            });
        }

        const uniqueNewEmails = validEmails.filter(
            email => !adminSettings.subscribedEmails.includes(email)
        );

        adminSettings.subscribedEmails.push(...uniqueNewEmails);
        await adminSettings.save();

        res.status(200).json({
            success: true,
            message: `${uniqueNewEmails.length} email(s) added successfully`,
            addedEmails: uniqueNewEmails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});