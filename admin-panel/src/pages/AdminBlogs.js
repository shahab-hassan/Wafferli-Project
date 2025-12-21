import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Loader from '../utils/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import JoditEditor from 'jodit-react';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Food & Dining',
        tags: '',
        authorName: '',
        authorImage: '',
        authorBio: '',
        readTime: '5 min read',
        featured: false,
        trending: false,
        status: 'published'
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ open: false, id: null });
    const [filterStatus, setFilterStatus] = useState('all');

    const token = localStorage.getItem('adminToken');

    const categories = [
        'Food & Dining', 'Lifestyle', 'Business', 'Events',
        'Culture', 'Technology', 'Travel', 'Health & Wellness'
    ];

    useEffect(() => {
        fetchAllBlogs();
    }, [filterStatus]);

    const fetchAllBlogs = async () => {
        try {
            setIsLoading(true);
            const url = filterStatus === 'all'
                ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/admin/all`
                : `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/admin/all?status=${filterStatus}`;
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Failed to fetch blogs', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const joditConfig = {
        readonly: isLoading,
        placeholder: 'Enter blog content',
        height: 400,
        uploader: {
            url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/upload-media`,
            headers: { Authorization: `Bearer ${token}` },
            format: 'json',
            insertImageAsBase64URI: false,
            imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
            filesVariableName: function (t) { return 'media'; },
            withCredentials: false,
            pathVariableName: 'path',
            isSuccess: function (resp) {
                return resp.success;
            },
            process: function (resp) {
                return { files: [resp.url] };
            },
            defaultHandlerSuccess: function (data, resp) {
                this.selection.insertImage(data.files[0]);
            },
            error: function (e) {
                enqueueSnackbar('Upload failed', { variant: 'error' });
            }
        },
        buttons: [
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'paragraph', '|',
            'image', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'fullsize', 'source'
        ],
        removeButtons: ['file']
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === 'title' && !editMode ? { slug: generateSlug(value) } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.slug.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
            enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                author: {
                    name: formData.authorName,
                    image: formData.authorImage,
                    bio: formData.authorBio
                }
            };

            if (editMode) {
                const { data } = await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/admin/${editId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('Blog updated successfully', { variant: 'success' });
                    resetForm();
                    fetchAllBlogs();
                }
            } else {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/admin/new`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('Blog created successfully', { variant: 'success' });
                    resetForm();
                    fetchAllBlogs();
                }
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setEditMode(true);
        setEditId(blog._id);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image || '',
            category: blog.category,
            tags: blog.tags.join(', '),
            authorName: blog.author.name,
            authorImage: blog.author.image || '',
            authorBio: blog.author.bio || '',
            readTime: blog.readTime,
            featured: blog.featured,
            trending: blog.trending,
            status: blog.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id) => {
        setShowDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/admin/${showDeleteConfirm.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                enqueueSnackbar('Blog deleted successfully', { variant: 'success' });
                fetchAllBlogs();
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm({ open: false, id: null });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: '',
            category: 'Food & Dining',
            tags: '',
            authorName: '',
            authorImage: '',
            authorBio: '',
            readTime: '5 min read',
            featured: false,
            trending: false,
            status: 'published'
        });
        setEditMode(false);
        setEditId(null);
    };

    return (
        <>
            {isLoading && <Loader type="checkmate" />}

            <div className='adminFAQDiv'>
                <div className='adminFAQContent'>
                    <h2 className='secondaryHeading'>Manage <span>Blogs</span></h2>
                    <div className="horizontalLine"></div>

                    {/* Blog Form */}
                    <form onSubmit={handleSubmit} className='form'>
                        <h3 className='tertiaryHeading'>{editMode ? 'Edit Blog' : 'Create New Blog'}</h3>

                        <div className="inputDiv">
                            <label>Title <span>*</span></label>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder='Enter blog title'
                                className='inputField'
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Slug <span>*</span></label>
                            <input
                                type='text'
                                name='slug'
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder='blog-post-slug'
                                className='inputField'
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Excerpt <span>*</span></label>
                            <textarea
                                name='excerpt'
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                placeholder='Brief description of the blog post'
                                className='inputField'
                                rows="3"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Content <span>*</span></label>
                            <JoditEditor
                                value={formData.content}
                                config={joditConfig}
                                onBlur={newContent => setFormData(prev => ({ ...prev, content: newContent }))}
                                onChange={() => { }}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Featured Image URL</label>
                            <input
                                type='text'
                                name='image'
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder='https://example.com/image.jpg'
                                className='inputField'
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv" style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Category <span>*</span></label>
                                <select
                                    name='category'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className='inputField dropdownLight'
                                    disabled={isLoading}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Read Time</label>
                                <input
                                    type='text'
                                    name='readTime'
                                    value={formData.readTime}
                                    onChange={handleInputChange}
                                    placeholder='5 min read'
                                    className='inputField'
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label>Tags (comma separated)</label>
                            <input
                                type='text'
                                name='tags'
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder='kuwait, food, travel'
                                className='inputField'
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Author Name</label>
                            <input
                                type='text'
                                name='authorName'
                                value={formData.authorName}
                                onChange={handleInputChange}
                                placeholder='John Doe'
                                className='inputField'
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Author Image URL</label>
                            <input
                                type='text'
                                name='authorImage'
                                value={formData.authorImage}
                                onChange={handleInputChange}
                                placeholder='https://example.com/author.jpg'
                                className='inputField'
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Author Bio</label>
                            <textarea
                                name='authorBio'
                                value={formData.authorBio}
                                onChange={handleInputChange}
                                placeholder='Brief author bio'
                                className='inputField'
                                rows="2"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type='checkbox'
                                    name='featured'
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                                Featured
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type='checkbox'
                                    name='trending'
                                    checked={formData.trending}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                                Trending
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Status:
                                <select
                                    name='status'
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className='inputField dropdownLight'
                                    style={{ width: 'auto', marginLeft: '8px' }}
                                    disabled={isLoading}
                                >
                                    <option value='published'>Published</option>
                                    <option value='draft'>Draft</option>
                                </select>
                            </label>
                        </div>

                        <div className="buttonsRow">
                            <button type='submit' className='primaryBtn' disabled={isLoading}>
                                {editMode ? 'Update Blog' : 'Create Blog'}
                            </button>
                            {editMode && (
                                <button
                                    type='button'
                                    className='secondaryBtn'
                                    onClick={resetForm}
                                    disabled={isLoading}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="horizontalLine"></div>

                    {/* Filter */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label>Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='inputField dropdownLight'
                            style={{ width: 'auto' }}
                        >
                            <option value='all'>All</option>
                            <option value='published'>Published</option>
                            <option value='draft'>Draft</option>
                        </select>
                    </div>

                    {/* Blog List */}
                    <div className='groupedFaqList'>
                        <h3 className='tertiaryHeading'>All Blogs ({blogs.length})</h3>
                        {blogs.length === 0 ? (
                            <p>No blogs found.</p>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="faqRow" style={{ alignItems: 'flex-start' }}>
                                        <div className='faqQA' style={{ flex: 1 }}>
                                            <p className='question' style={{ marginBottom: '8px' }}>
                                                {blog.title}
                                                <span style={{
                                                    marginLeft: '10px',
                                                    fontSize: '12px',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: blog.status === 'published' ? '#10b981' : '#6b7280',
                                                    color: 'white'
                                                }}>
                                                    {blog.status}
                                                </span>
                                                {blog.featured && <span style={{ marginLeft: '5px', fontSize: '12px', color: '#f59e0b' }}>⭐ Featured</span>}
                                                {blog.trending && <span style={{ marginLeft: '5px', fontSize: '12px', color: '#ef4444' }}>🔥 Trending</span>}
                                            </p>
                                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                                {blog.excerpt}
                                            </p>
                                            <div style={{ fontSize: '12px', color: '#999', display: 'flex', gap: '15px' }}>
                                                <span>📁 {blog.category}</span>
                                                <span>👁 {blog.views} views</span>
                                                <span>❤ {blog.likes} likes</span>
                                                <span>💬 {blog.comments.length} comments</span>
                                                <span>🕒 {blog.readTime}</span>
                                            </div>
                                        </div>
                                        <div className='faqActions'>
                                            <button
                                                onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/blog/${blog.slug}`, '_blank')}
                                                className="editBtn"
                                                title="View Blog"
                                                disabled={isLoading}
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="editBtn"
                                                disabled={isLoading}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(blog._id)}
                                                className="deleteBtn"
                                                disabled={isLoading}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    open={showDeleteConfirm.open}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this blog? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteConfirm({ open: false, id: null })}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
}

export default AdminBlogs;