const express = require('express');
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    getPublishedBlogs,
    toggleLikeBlog,
    addComment,
    deleteComment,
    toggleLikeComment
} = require('../controllers/blogCtrl');
const { authorizeAdmin, authorized } = require('../middlewares/authorization');
const upload = require('../config/multer');

// Admin routes
router.post('/admin/new', authorizeAdmin, createBlog);
router.get('/admin/all', authorizeAdmin, getAllBlogs);
router.put('/admin/:id', authorizeAdmin, updateBlog);
router.delete('/admin/:id', authorizeAdmin, deleteBlog);

// Public routes
router.get('/published', getPublishedBlogs);
router.get('/:slug', getBlogBySlug);

// User interaction routes (require authentication)
router.post('/:slug/like', authorized, toggleLikeBlog);
router.post('/:slug/comment', authorized, addComment);
router.delete('/:slug/comment/:commentId', authorized, deleteComment);
router.post('/:slug/comment/:commentId/like', authorized, toggleLikeComment);

// Media upload for blog
router.post('/upload-media', authorizeAdmin, upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    res.json({ success: true, url: req.file.path });
});

module.exports = router;