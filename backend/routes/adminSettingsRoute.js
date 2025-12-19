// File: src/routes/adminSettingsRoute.js
const express = require('express');
const router = express.Router();
const { addEmails, deleteEmail, sendEmailFromAdmin, getAllEmails, subscribeEmailByUser, getTerms, createOrUpdateTerms, getSocialLinks, createOrUpdateSocialLinks, getGeneralDashboardInfo, receiveEmailFromUser } = require('../controllers/adminSettingsCtrl');
const { authorizeAdmin } = require('../middlewares/authorization');

router.get('/terms', getTerms);
router.post('/terms', authorizeAdmin, createOrUpdateTerms);

router.get('/social-links', getSocialLinks);
router.post('/social-links', authorizeAdmin, createOrUpdateSocialLinks);

router.post('/receive/email', receiveEmailFromUser);

router.post('/subscribe', subscribeEmailByUser);
router.get('/emails', authorizeAdmin, getAllEmails);
router.post('/send/email', authorizeAdmin, sendEmailFromAdmin);

router.post('/emails/delete', authorizeAdmin, deleteEmail);
router.post('/emails/add', authorizeAdmin, addEmails);


module.exports = router;