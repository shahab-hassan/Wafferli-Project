import React, { useState, useEffect } from 'react';
import Dropdown from '../components/common/Dropdown';
import SearchInput from '../components/common/SearchInput';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdOpenInNew } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Loader from '../utils/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';

function AdminProductAds() {
    const [products, setProducts] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const searchTypeMap = {
        Title: 'title',
    };

    useEffect(() => {
        fetchProducts();
    }, [filterType]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/products/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setProducts(response.data.ads);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchProducts();
    };

    const handleDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/delete/${selectedProductId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setProducts(products.filter(p => p._id !== selectedProductId));
                enqueueSnackbar('Product ad deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete product ad', { variant: 'error' });
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const openDetailsModal = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (productId) => {
        setSelectedProductId(productId);
        setConfirmDialogOpen(true);
    };

    const productElems = products.length > 0 ? (
        products.map((product, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field">
                        <p className="title">{product.title}</p>
                    </div>
                    <p className="field">{product.seller?.name || product.userId?.fullName || 'N/A'}</p>
                    <p className="field">{product.category}</p>
                    <p className="field">{product.subCategory}</p>
                    <p className="priceField field">${product.askingPrice}</p>
                    <p className="field">{product.quantity || 'N/A'}</p>
                    <p className="ratingField field">{product.rating?.toFixed(1) || '0.0'}</p>
                    <div className="actionsField field">
                        <FaEye
                            className="icon"
                            onClick={() => openDetailsModal(product)}
                            title="View Details"
                        />
                        <FaTrash
                            className="icon delete"
                            onClick={() => openDeleteDialog(product._id)}
                            title="Delete"
                        />
                        <MdOpenInNew
                            className="icon"
                            onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/product/${product._id}`, '_blank')}
                            title="Open in New Tab"
                        />
                    </div>
                </div>
                {products.length > 1 && products.length - 1 !== index && <div className="horizontalLine"></div>}
            </div>
        ))
    ) : (
        <div className="row">Nothing to show here...</div>
    );

    return (
        <div className="adminProductsDiv">
            <div className="adminProductsContent">
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{filterType} </span>Product Ads
                                <span className="totalRows">- {(products.length < 10 ? '0' : '') + products.length}</span>
                            </h2>
                            <div className="upperRight">
                                <SearchInput
                                    searchType={searchType}
                                    setSearchType={setSearchType}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    searchTypeMap={searchTypeMap}
                                    placeholder={`Search by ${searchType}`}
                                    onSearch={handleSearch}
                                />
                                <Dropdown
                                    options={['All', 'HighRated', 'LowRated', 'Popular']}
                                    onSelect={setFilterType}
                                    selected={filterType}
                                />
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Title</p>
                            <p>Seller</p>
                            <p>Category</p>
                            <p>SubCategory</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Rating</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{productElems}</div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedProduct && (
                    <div className="popupDiv addNewModelDiv">
                        <div className="popupContent">
                            <div className="form">
                                <h2 className="secondaryHeading">
                                    Product Ad <span>Details</span>
                                </h2>

                                <div className="rows">
                                    <div className="row">
                                        <div>ID</div>
                                        <div className="fw600">{selectedProduct._id}</div>
                                    </div>
                                    <div className="row">
                                        <div>Title</div>
                                        <div className="fw600">{selectedProduct.title}</div>
                                    </div>
                                    <div className="row">
                                        <div>Description</div>
                                        <div className="fw600">{selectedProduct.description}</div>
                                    </div>
                                    <div className="row">
                                        <div>Category</div>
                                        <div className="fw600">{selectedProduct.category}</div>
                                    </div>
                                    <div className="row">
                                        <div>SubCategory</div>
                                        <div className="fw600">{selectedProduct.subCategory}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Price & <span>Quantity</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Asking Price</div>
                                        <div className="fw600">${selectedProduct.askingPrice}</div>
                                    </div>
                                    {selectedProduct.discount && (
                                        <div className="row">
                                            <div>Discount</div>
                                            <div className="fw600">{selectedProduct.discountPercent}%</div>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div>Quantity</div>
                                        <div className="fw600">{selectedProduct.quantity || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Location & <span>Contact</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>City</div>
                                        <div className="fw600">{selectedProduct.city || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Neighbourhood</div>
                                        <div className="fw600">{selectedProduct.neighbourhood || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Phone</div>
                                        <div className="fw600">{selectedProduct.phone}</div>
                                    </div>
                                    <div className="row">
                                        <div>Show Phone</div>
                                        <div className="fw600">{selectedProduct.showPhone ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Engagement & <span>Status</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Rating</div>
                                        <div className="fw600">{selectedProduct.rating?.toFixed(1)} ({selectedProduct.reviewsCount} reviews)</div>
                                    </div>
                                    <div className="row">
                                        <div>Favorites</div>
                                        <div className="fw600">{selectedProduct.favoritesCount}</div>
                                    </div>
                                    <div className="row">
                                        <div>Created</div>
                                        <div className="fw600">{new Date(selectedProduct.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {selectedProduct.images && selectedProduct.images.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Product <span>Images</span>
                                        </h2>
                                        <div className="productImages">
                                            {selectedProduct.images.map((image, idx) => (
                                                <img key={idx} src={image} alt={`Product ${idx + 1}`} />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="buttonsDiv">
                                    <button className="secondaryBtn" onClick={() => setShowDetailsModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="popupCloseBtn">
                            <IoIosCloseCircleOutline className="icon" onClick={() => setShowDetailsModal(false)} />
                        </div>
                    </div>
                )}

                {/* Confirm Dialog */}
                <ConfirmDialog
                    open={confirmDialogOpen}
                    title="Delete Product Ad"
                    message="Are you sure you want to delete this product ad? This action cannot be undone."
                    onConfirm={handleDeleteProduct}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminProductAds;