const express = require('express');
const router = express.Router();
const { createFAQ, getAllFAQs, updateFAQ, deleteFAQ, createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/faqCtrl');
const { authorizeAdmin } = require('../middlewares/authorization');
const upload = require('../config/multer');

router.get('/all', getAllFAQs);
router.post('/new', authorizeAdmin, createFAQ);
router.put('/:id', authorizeAdmin, updateFAQ);
router.delete('/:id', authorizeAdmin, deleteFAQ);

router.post('/category/new', authorizeAdmin, createCategory);
router.get('/categories', getAllCategories);
router.put('/category/:id', authorizeAdmin, updateCategory);
router.delete('/category/:id', authorizeAdmin, deleteCategory);

router.post('/upload-media', authorizeAdmin, upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ success: true, url: req.file.path });
});

module.exports = router;