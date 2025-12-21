const express = require('express');
const router = express.Router();
const {
    addEmails,
    deleteEmail,
    sendEmailFromAdmin,
    getAllEmails,
    subscribeEmailByUser,
    getTermsAndPrivacy,
    createOrUpdateTermsAndPrivacy,
    getGeneralDashboardInfo,
    receiveEmailFromUser
} = require('../controllers/adminSettingsCtrl');
const { authorizeAdmin } = require('../middlewares/authorization');

// Dashboard
router.get('/dashboard/general', authorizeAdmin, getGeneralDashboardInfo);

// Terms & Privacy Policy
router.get('/terms-privacy', getTermsAndPrivacy);
router.post('/terms-privacy', authorizeAdmin, createOrUpdateTermsAndPrivacy);

// Email Management
router.post('/receive/email', receiveEmailFromUser);
router.post('/subscribe', subscribeEmailByUser);
router.get('/emails', authorizeAdmin, getAllEmails);
router.post('/send/email', authorizeAdmin, sendEmailFromAdmin);
router.post('/emails/delete', authorizeAdmin, deleteEmail);
router.post('/emails/add', authorizeAdmin, addEmails);

module.exports = router;