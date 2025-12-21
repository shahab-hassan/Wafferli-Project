const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');

// Admin Controllers
exports.createBlog = asyncHandler(async (req, res) => {
    const { title, slug, excerpt, content, image, category, tags, author, readTime, featured, trending, status } = req.body;

    if (!title || !slug || !excerpt || !content || !category) {
        res.status(400);
        throw new Error('Required fields missing');
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
        res.status(400);
        throw new Error('Slug already exists');
    }

    const blog = await Blog.create({
        title, slug, excerpt, content, image, category, tags, author, readTime, featured, trending, status
    });

    res.status(201).json({ success: true, blog });
});

exports.getAllBlogs = asyncHandler(async (req, res) => {
    const { status, category, featured, trending } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (trending) filter.trending = trending === 'true';

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
});

exports.getBlogBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('comments.author', 'fullName email');

    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, blog });
});

exports.updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    Object.keys(req.body).forEach(key => {
        blog[key] = req.body[key];
    });

    await blog.save();
    res.status(200).json({ success: true, blog });
});

exports.deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    res.status(200).json({ success: true, message: 'Blog deleted' });
});

// Public Controllers
exports.getPublishedBlogs = asyncHandler(async (req, res) => {
    const { category, featured, trending, limit, skip } = req.query;
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (trending) filter.trending = true;

    const blogs = await Blog.find(filter)
        .sort({ publishDate: -1 })
        .limit(parseInt(limit) || 0)
        .skip(parseInt(skip) || 0)
        .select('-comments');

    const total = await Blog.countDocuments(filter);

    res.status(200).json({ success: true, blogs, total });
});

// Like/Unlike Blog
exports.toggleLikeBlog = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    const hasLiked = blog.likedBy.includes(userId);

    if (hasLiked) {
        blog.likedBy = blog.likedBy.filter(id => id.toString() !== userId.toString());
        blog.likes -= 1;
    } else {
        blog.likedBy.push(userId);
        blog.likes += 1;
    }

    await blog.save();
    res.status(200).json({ success: true, liked: !hasLiked, likes: blog.likes });
});

// Comments
exports.addComment = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
        res.status(400);
        throw new Error('Comment content required');
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    blog.comments.push({ author: userId, content });
    await blog.save();

    const updatedBlog = await Blog.findOne({ slug }).populate('comments.author', 'fullName email');
    res.status(201).json({ success: true, comments: updatedBlog.comments });
});

exports.deleteComment = asyncHandler(async (req, res) => {
    const { slug, commentId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Only comment author can delete
    if (comment.author.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    comment.deleteOne();
    await blog.save();

    res.status(200).json({ success: true, message: 'Comment deleted' });
});

exports.toggleLikeComment = asyncHandler(async (req, res) => {
    const { slug, commentId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    const hasLiked = comment.likedBy.includes(userId);

    if (hasLiked) {
        comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId.toString());
        comment.likes -= 1;
    } else {
        comment.likedBy.push(userId);
        comment.likes += 1;
    }

    await blog.save();
    res.status(200).json({ success: true, liked: !hasLiked, likes: comment.likes });
});