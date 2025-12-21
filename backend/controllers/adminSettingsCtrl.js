const AdminSettings = require("../models/adminSettingsModel");
const User = require("../models/user.model");
const Seller = require("../models/seller.model");
const Ad = require("../models/ad/baseAd.model");
const Blog = require("../models/blogModel");
const nodemailer = require("nodemailer");

const getGeneralDashboardInfo = async (req, res) => {
    try {
        // 1. User Metrics
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        // 2. Content Metrics (Renamed from Ads)
        const totalListings = await Ad.countDocuments();
        const productListings = await Ad.countDocuments({ adType: "product" });
        const serviceListings = await Ad.countDocuments({ adType: "service" });
        const eventListings = await Ad.countDocuments({ adType: "event" });
        const exploreListings = await Ad.countDocuments({ adType: "explore" });
        const offerListings = await Ad.countDocuments({ adType: "offer" });

        // 3. Community Metrics (Blog & Newsletter)
        const totalBlogPosts = await Blog.countDocuments();
        const settings = await AdminSettings.findOne();
        const totalSubscribers = settings?.subscribedEmails?.length || 0;

        // 4. Engagement Metrics
        const totalReviews = await Ad.aggregate([
            { $group: { _id: null, total: { $sum: "$reviewsCount" } } }
        ]);
        const totalFavorites = await Ad.aggregate([
            { $group: { _id: null, total: { $sum: "$favoritesCount" } } }
        ]);

        const generalInfo = {
            totalUsers,
            verifiedUsers,
            unverifiedUsers: totalUsers - verifiedUsers,

            totalListings,
            productListings,
            serviceListings,
            eventListings,
            exploreListings,
            offerListings,

            totalBlogPosts,
            totalSubscribers,

            totalReviews: totalReviews[0]?.total || 0,
            totalFavorites: totalFavorites[0]?.total || 0,
        };

        res.status(200).json({ success: true, generalInfo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Terms & Privacy Policy
const getTermsAndPrivacy = async (req, res) => {
    try {
        const settings = await AdminSettings.findOne();
        res.status(200).json({
            success: true,
            terms: settings?.terms || "",
            privacyPolicy: settings?.privacyPolicy || ""
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createOrUpdateTermsAndPrivacy = async (req, res) => {
    try {
        const { terms, privacyPolicy } = req.body;
        let settings = await AdminSettings.findOne();

        if (!settings) {
            settings = await AdminSettings.create({ terms, privacyPolicy });
        } else {
            if (terms !== undefined) settings.terms = terms;
            if (privacyPolicy !== undefined) settings.privacyPolicy = privacyPolicy;
            await settings.save();
        }

        res.status(200).json({ success: true, message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Email Management
const subscribeEmailByUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email' });
        }

        let settings = await AdminSettings.findOne();

        if (!settings) {
            settings = await AdminSettings.create({ subscribedEmails: [email] });
        } else {
            if (!settings.subscribedEmails.includes(email)) {
                settings.subscribedEmails.push(email);
                await settings.save();
            } else {
                return res.status(400).json({ success: false, error: 'Email already subscribed' });
            }
        }

        res.status(200).json({ success: true, message: "Email subscribed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllEmails = async (req, res) => {
    try {
        const settings = await AdminSettings.findOne();
        res.status(200).json({
            success: true,
            emails: settings?.subscribedEmails || []
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const addEmails = async (req, res) => {
    try {
        const { emails } = req.body;
        let settings = await AdminSettings.findOne();

        if (!settings) {
            settings = await AdminSettings.create({ subscribedEmails: emails });
        } else {
            const newEmails = [];
            emails.forEach(email => {
                if (!settings.subscribedEmails.includes(email)) {
                    settings.subscribedEmails.push(email);
                    newEmails.push(email);
                }
            });
            await settings.save();

            return res.status(200).json({
                success: true,
                message: `Added ${newEmails.length} email(s)`,
                addedEmails: newEmails
            });
        }

        res.status(200).json({ success: true, message: "Emails added successfully", addedEmails: emails });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const settings = await AdminSettings.findOne();

        if (settings) {
            settings.subscribedEmails = settings.subscribedEmails.filter(e => e !== email);
            await settings.save();
        }

        res.status(200).json({ success: true, message: "Email deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const sendEmailFromAdmin = async (req, res) => {
    try {
        const { recipients, subject, body } = req.body;

        if (!recipients || !recipients.length) {
            return res.status(400).json({ success: false, error: 'No recipients provided' });
        }

        const transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipients.join(","),
            subject,
            html: body,
        });

        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const receiveEmailFromUser = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: email,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getGeneralDashboardInfo,
    getTermsAndPrivacy,
    createOrUpdateTermsAndPrivacy,
    subscribeEmailByUser,
    getAllEmails,
    addEmails,
    deleteEmail,
    sendEmailFromAdmin,
    receiveEmailFromUser,
};