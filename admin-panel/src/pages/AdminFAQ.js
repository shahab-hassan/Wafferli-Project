import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaEdit, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Loader from '../utils/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import JoditEditor from 'jodit-react';

function AdminFAQ() {
    const [faqs, setFaqs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openCategories, setOpenCategories] = useState({}); // Object for per-category state

    const [catName, setCatName] = useState('');
    const [catColor, setCatColor] = useState('#000000');
    const [catEditMode, setCatEditMode] = useState(false);
    const [catEditId, setCatEditId] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ open: false, id: null, type: null });

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        fetchAllFAQs();
        fetchAllCategories();
    }, []);

    const fetchAllFAQs = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/all`);
            if (data.success) {
                setFaqs(data.faqs);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/categories`);
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        }
    };

    const joditConfig = {
        readonly: isLoading,
        placeholder: 'Enter answer',
        height: 300,
        uploader: {
            url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/upload-media`,
            headers: { Authorization: `Bearer ${token}` },
            format: 'json',
            insertImageAsBase64URI: false,
            imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
            filesVariableName: function (t) { return 'media'; }, // Match backend field name
            withCredentials: false,
            pathVariableName: 'path',
            isSuccess: function (resp) {
                return resp.success;
            },
            process: function (resp) {
                return { files: [resp.url] }; // Return URL from backend response
            },
            defaultHandlerSuccess: function (data, resp) {
                this.selection.insertImage(data.files[0]);
            },
            error: function (e) {
                enqueueSnackbar('Upload failed', { variant: 'error' });
            }
        },
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize', 'selectall', 'print'
        ],
        removeButtons: ['file', 'source']
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) {
            enqueueSnackbar('Both question and answer are required', { variant: 'warning' });
            return;
        }
        if (categories.length === 0) {
            enqueueSnackbar('Please add at least one category before adding FAQs', { variant: 'warning' });
            return;
        }
        setIsLoading(true);
        let category = selectedCategory;
        if (category === '') category = categories[0]?._id;
        try {
            if (editMode) {
                const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/${editId}`,
                    { question, answer, category },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('FAQ updated successfully', { variant: 'success' });
                    resetForm();
                    fetchAllFAQs();
                }
            } else {
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/new`,
                    { question, answer, category },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('FAQ created successfully', { variant: 'success' });
                    resetForm();
                    fetchAllFAQs();
                }
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (faq) => {
        setEditMode(true);
        setEditId(faq._id);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setSelectedCategory(faq.category ? faq.category._id : '');
    };

    const handleAddOrUpdateCategory = async (e) => {
        e.preventDefault();
        if (!catName.trim()) {
            enqueueSnackbar('Category name is required', { variant: 'warning' });
            return;
        }
        setIsLoading(true);
        try {
            if (catEditMode) {
                const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/category/${catEditId}`,
                    { name: catName, color: catColor },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('Category updated successfully', { variant: 'success' });
                    resetCatForm();
                    fetchAllCategories();
                    fetchAllFAQs();
                }
            } else {
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/category/new`,
                    { name: catName, color: catColor },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    enqueueSnackbar('Category created successfully', { variant: 'success' });
                    resetCatForm();
                    fetchAllCategories();
                    fetchAllFAQs();
                }
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCat = (cat) => {
        setCatEditMode(true);
        setCatEditId(cat._id);
        setCatName(cat.name);
        setCatColor(cat.color || '#000000');
    };

    const handleDeleteClick = (id, type = 'faq') => {
        setShowDeleteConfirm({ open: true, id, type });
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const { id, type } = showDeleteConfirm;
            let url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/${id}`;
            if (type === 'category') {
                url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/category/${id}`;
            }
            const { data } = await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                enqueueSnackbar(`${type === 'category' ? 'Category' : 'FAQ'} deleted successfully`, { variant: 'success' });
                if (type === 'category') {
                    fetchAllCategories();
                    fetchAllFAQs();
                } else {
                    fetchAllFAQs();
                }
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm({ open: false, id: null, type: null });
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm({ open: false, id: null, type: null });
    };

    const resetForm = () => {
        setQuestion('');
        setAnswer('');
        setSelectedCategory('');
        setEditMode(false);
        setEditId(null);
    };

    const resetCatForm = () => {
        setCatName('');
        setCatColor('#000000');
        setCatEditMode(false);
        setCatEditId(null);
    };

    const toggleCategory = (catId) => {
        setOpenCategories((prev) => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Group FAQs by category
    const groupedFaqs = faqs.reduce((acc, faq) => {
        const catId = faq.category ? faq.category._id : 'uncategorized';
        const catName = faq.category ? faq.category.name : 'Uncategorized';
        const catColor = faq.category ? faq.category.color : '#333333';
        if (!acc[catId]) {
            acc[catId] = { name: catName, color: catColor, faqs: [], id: catId };
        }
        acc[catId].faqs.push(faq);
        return acc;
    }, {});

    // Combine with all categories (even empty ones)
    categories.forEach((cat) => {
        if (!groupedFaqs[cat._id]) {
            groupedFaqs[cat._id] = { name: cat.name, color: cat.color, faqs: [], id: cat._id };
        }
    });

    // Sort groups alphabetically by name, exclude 'uncategorized' if categories exist
    let sortedGroups = Object.values(groupedFaqs).sort((a, b) => a.name.localeCompare(b.name));
    if (categories.length > 0) {
        sortedGroups = sortedGroups.filter(group => group.id !== 'uncategorized');
    }

    return (
        <>
            {isLoading && <Loader type="checkmate" />}

            <div className='adminFAQDiv'>
                <div className='adminFAQContent'>
                    <h2 className='secondaryHeading'>Information Center - <span>FAQ</span></h2>
                    <div className="horizontalLine"></div>

                    {/* Category Management Form */}
                    <form onSubmit={handleAddOrUpdateCategory} className='form'>
                        <h3 className='tertiaryHeading'>Manage Categories</h3>
                        <div className="inputDiv" style={{ justifyContent: "left" }}>

                            <div className="inputInnerDiv" style={{ width: "50%" }}>
                                <label>Name <span>*</span></label>
                                <input
                                    type='text'
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    placeholder='Enter category name'
                                    className='inputField'
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="inputInnerDiv" style={{ width: "fit-content" }}>
                                {/* <label>Color</label> */}
                                <input
                                    type='color'
                                    value={catColor}
                                    onChange={(e) => setCatColor(e.target.value)}
                                    className='colorPicker'
                                    disabled={isLoading}
                                    style={{ marginTop: "28px", "width": "40px", "height": "40px", "outline": "none", "border": "none", "padding": "0", "cursor": "pointer" }}
                                />
                            </div>
                        </div>

                        <div className="buttonsRow">
                            <button type='submit' className='primaryBtn' disabled={isLoading}>
                                {catEditMode ? 'Update Category' : 'Add Category'}
                            </button>
                            {catEditMode && (
                                <button
                                    type='button'
                                    className='secondaryBtn'
                                    onClick={resetCatForm}
                                    disabled={isLoading}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="horizontalLine"></div>

                    {/* FAQ Management Form */}
                    <form onSubmit={handleAddOrUpdate} className='form'>
                        <h3 className='tertiaryHeading'>Manage FAQs</h3>
                        <div className="inputDiv">
                            <label>Question <span>*</span></label>
                            <input
                                type='text'
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder='Enter question'
                                className='inputField'
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="inputDiv">
                            <label>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className='inputField dropdownLight'
                                disabled={isLoading}
                            >
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="inputDiv">
                            <label>Answer <span>*</span></label>
                            <JoditEditor
                                value={answer}
                                config={joditConfig}
                                onBlur={newContent => setAnswer(newContent)}
                                onChange={() => { }}
                            />
                        </div>

                        <div className="buttonsRow">
                            <button type='submit' className='primaryBtn' disabled={isLoading}>
                                {editMode ? 'Update FAQ' : 'Add FAQ'}
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

                    {/* Grouped FAQ List with Accordions */}
                    <div className='groupedFaqList'>
                        <h3 className='tertiaryHeading'>FAQ Groups</h3>
                        {categories.length === 0 ? (
                            <p>No categories added. Add categories to organize FAQs.</p>
                        ) : null}
                        {sortedGroups.length === 0 && categories.length > 0 ? (
                            <p>No FAQs added yet.</p>
                        ) : (
                            sortedGroups.map((group) => (
                                <div key={group.id} className="categoryAccordion">
                                    <div className="categoryHeader" onClick={() => toggleCategory(group.id)}>
                                        <h4 style={{ color: group.color }}>{group.name}</h4>
                                        <div className="categoryActions">
                                            {group.id !== 'general' && (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEditCat({ _id: group.id, name: group.name, color: group.color }); }}
                                                        className="editBtn"
                                                        disabled={isLoading}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(group.id, 'category'); }}
                                                        className="deleteBtn"
                                                        disabled={isLoading}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                            {openCategories[group.id] ? (
                                                <FaMinus className="toggleIcon" />
                                            ) : (
                                                <FaPlus className="toggleIcon" />
                                            )}
                                        </div>
                                    </div>
                                    {openCategories[group.id] && (
                                        <div className="categoryContent">
                                            {group.faqs.length === 0 ? (
                                                <p>No FAQs in this category.</p>
                                            ) : (
                                                group.faqs.map((faq, index) => (
                                                    <div key={faq._id} className="faqRow">
                                                        <div className='faqQA'>
                                                            <p className='question'>
                                                                {faq.question}
                                                            </p>
                                                            <div className='answer'>
                                                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                            </div>
                                                        </div>
                                                        <div className='faqActions'>
                                                            <button
                                                                onClick={() => handleEdit(faq)}
                                                                className="editBtn"
                                                                disabled={isLoading}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(faq._id, 'faq')}
                                                                className="deleteBtn"
                                                                disabled={isLoading}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    open={showDeleteConfirm.open}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete this ${showDeleteConfirm.type === 'category' ? 'category' : 'FAQ'}?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
}

export default AdminFAQ;