
const asyncHandler = require('express-async-handler');
const {FAQ, FAQCategory} = require('../models/faqModel');

exports.createFAQ = asyncHandler(async (req, res) => {
    let { question, answer, category } = req.body;
    if (!question || !answer) {
        res.status(400);
        throw new Error('Both question and answer are required');
    }
    if (category === '') category = null;
    const newFAQ = await FAQ.create({ question, answer, category });
    res.status(200).json({ success: true, faq: newFAQ });
});

exports.getAllFAQs = asyncHandler(async (req, res) => {
    const faqs = await FAQ.find({}).populate('category');
    res.status(200).json({ success: true, faqs });
});

exports.updateFAQ = asyncHandler(async (req, res) => {
    let { question, answer, category } = req.body;
    const { id } = req.params;
    const faq = await FAQ.findById(id);
    if (!faq) {
        res.status(404);
        throw new Error('FAQ not found');
    }
    if (category === '') category = null;
    faq.question = question !== undefined ? question : faq.question;
    faq.answer = answer !== undefined ? answer : faq.answer;
    faq.category = category !== undefined ? category : faq.category;
    await faq.save();
    res.status(200).json({ success: true, faq });
});

exports.deleteFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await FAQ.findByIdAndDelete(id);
    if (!doc) {
        res.status(404);
        throw new Error('FAQ not found');
    }
    res.status(200).json({ success: true, message: 'FAQ deleted' });
});

exports.createCategory = asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Name is required');
    }
    const newCategory = await FAQCategory.create({ name, color });
    res.status(200).json({ success: true, category: newCategory });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await FAQCategory.find({});
    res.status(200).json({ success: true, categories });
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    const { id } = req.params;
    const category = await FAQCategory.findById(id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    category.name = name !== undefined ? name : category.name;
    category.color = color !== undefined ? color : category.color;
    await category.save();
    res.status(200).json({ success: true, category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await FAQCategory.findByIdAndDelete(id);
    if (!doc) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json({ success: true, message: 'Category deleted' });
});