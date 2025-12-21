const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'FAQCategory', default: null },
}, { timestamps: true });



const faqCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String, default: '#000000' },
}, { timestamps: true });

module.exports = {
    FAQ: mongoose.model('FAQ', faqSchema),
    FAQCategory: mongoose.model('FAQCategory', faqCategorySchema),
};