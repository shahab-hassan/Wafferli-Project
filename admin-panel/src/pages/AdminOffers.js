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

function AdminOfferAds() {
    const [offers, setOffers] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedOfferId, setSelectedOfferId] = useState(null);

    const searchTypeMap = {
        Title: 'title',
        ID: 'id',
        Seller: 'seller'
    };

    useEffect(() => {
        fetchOffers();
    }, [filterType]);

    const fetchOffers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/offers/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setOffers(response.data.ads);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchOffers();
    };

    const handleDeleteOffer = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/delete/${selectedOfferId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOffers(offers.filter(o => o._id !== selectedOfferId));
                enqueueSnackbar('Offer ad deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete offer ad', { variant: 'error' });
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const openDetailsModal = (offer) => {
        setSelectedOffer(offer);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (offerId) => {
        setSelectedOfferId(offerId);
        setConfirmDialogOpen(true);
    };

    const offerElems = offers.length > 0 ? (
        offers.map((offer, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field">
                        <p className="title">{offer.title}</p>
                    </div>
                    <p className="field">{offer.seller?.name || offer.userId?.fullName || 'N/A'}</p>
                    <p className="field">
                        {offer.discountPercent || 'N/A'}% OFF
                    </p>
                    <p className="field">{offer.city || 'N/A'}</p>
                    <p className="ratingField field">{offer.rating?.toFixed(1) || '0.0'}</p>
                    <p className="field">{offer.favoritesCount || 0}</p>
                    <div className="actionsField field">
                        <FaEye
                            className="icon"
                            onClick={() => openDetailsModal(offer)}
                            title="View Details"
                        />
                        <FaTrash
                            className="icon delete"
                            onClick={() => openDeleteDialog(offer._id)}
                            title="Delete"
                        />
                        <MdOpenInNew
                            className="icon"
                            onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/ad/${offer._id}`, '_blank')}
                            title="Open in New Tab"
                        />
                    </div>
                </div>
                {offers.length > 1 && offers.length - 1 !== index && <div className="horizontalLine"></div>}
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
                                <span>{filterType} </span>Offer Ads
                                <span className="totalRows">- {(offers.length < 10 ? '0' : '') + offers.length}</span>
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
                            <p>Discount</p>
                            <p>City</p>
                            <p>Rating</p>
                            <p>Favorites</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{offerElems}</div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedOffer && (
                    <div className="popupDiv addNewModelDiv">
                        <div className="popupContent">
                            <div className="form">
                                <h2 className="secondaryHeading">
                                    Offer Ad <span>Details</span>
                                </h2>

                                <div className="rows">
                                    <div className="row">
                                        <div>ID</div>
                                        <div className="fw600">{selectedOffer._id}</div>
                                    </div>
                                    <div className="row">
                                        <div>Title</div>
                                        <div className="fw600">{selectedOffer.title}</div>
                                    </div>
                                    <div className="row">
                                        <div>Description</div>
                                        <div className="fw600">{selectedOffer.description}</div>
                                    </div>
                                    {selectedOffer.discountPercent && (
                                        <div className="row">
                                            <div>Discount</div>
                                            <div className="fw600">{selectedOffer.discountPercent}% OFF</div>
                                        </div>
                                    )}
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Location & <span>Contact</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>City</div>
                                        <div className="fw600">{selectedOffer.city || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Neighbourhood</div>
                                        <div className="fw600">{selectedOffer.neighbourhood || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Phone</div>
                                        <div className="fw600">{selectedOffer.phone}</div>
                                    </div>
                                    <div className="row">
                                        <div>Show Phone</div>
                                        <div className="fw600">{selectedOffer.showPhone ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Engagement & <span>Status</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Rating</div>
                                        <div className="fw600">{selectedOffer.rating?.toFixed(1)} ({selectedOffer.reviewsCount} reviews)</div>
                                    </div>
                                    <div className="row">
                                        <div>Favorites</div>
                                        <div className="fw600">{selectedOffer.favoritesCount}</div>
                                    </div>
                                    <div className="row">
                                        <div>Created</div>
                                        <div className="fw600">{new Date(selectedOffer.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {selectedOffer.images && selectedOffer.images.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Offer <span>Images</span>
                                        </h2>
                                        <div className="productImages">
                                            {selectedOffer.images.map((image, idx) => (
                                                <img key={idx} src={image} alt={`Offer ${idx + 1}`} />
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

                <ConfirmDialog
                    open={confirmDialogOpen}
                    title="Delete Offer Ad"
                    message="Are you sure you want to delete this offer ad? This action cannot be undone."
                    onConfirm={handleDeleteOffer}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminOfferAds;