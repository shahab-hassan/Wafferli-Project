const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    terms: { type: String, default: '' },
    privacyPolicy: { type: String, default: '' },
    subscribedEmails: {
        type: [String],
        default: []
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);