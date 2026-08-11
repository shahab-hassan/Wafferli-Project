import React, { useState, useEffect, useCallback, useRef } from 'react';
import Dropdown from '../components/common/Dropdown';
import SearchInput from '../components/common/SearchInput';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdOpenInNew } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Loader from '../utils/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';

function AdminServiceAds() {
    const [services, setServices] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const searchTypeMap = {
        Title: 'title',
        ID: 'id',
        Category: 'category'
    };

    // Read at fetch time rather than depended on: typing in the search box
    // must not fire a request, only the Search button and the filter dropdown do.
    const searchQueryRef = useRef(searchQuery);
    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/services/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQueryRef.current }
                }
            );
            if (response.data.success) {
                setServices(response.data.ads);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [filterType]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSearch = () => {
        fetchServices();
    };

    const handleDeleteService = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/delete/${selectedServiceId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setServices(services.filter(s => s._id !== selectedServiceId));
                enqueueSnackbar('Service ad deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete service ad', { variant: 'error' });
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const openDetailsModal = (service) => {
        setSelectedService(service);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (serviceId) => {
        setSelectedServiceId(serviceId);
        setConfirmDialogOpen(true);
    };

    const serviceElems = services.length > 0 ? (
        services.map((service, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field">
                        <p className="title">{service.title}</p>
                    </div>
                    <p className="field">{service.seller?.name || service.userId?.fullName || 'N/A'}</p>
                    <p className="field">{service.category}</p>
                    <p className="field">{service.subCategory}</p>
                    <p className="priceField field">${service.servicePrice || 'N/A'}</p>
                    <p className="field">{service.serviceType || 'N/A'}</p>
                    <p className="ratingField field">{service.rating?.toFixed(1) || '0.0'}</p>
                    <div className="actionsField field">
                        <FaEye
                            className="icon"
                            onClick={() => openDetailsModal(service)}
                            title="View Details"
                        />
                        <FaTrash
                            className="icon delete"
                            onClick={() => openDeleteDialog(service._id)}
                            title="Delete"
                        />
                        <MdOpenInNew
                            className="icon"
                            onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/service/${service._id}`, '_blank')}
                            title="Open in New Tab"
                        />
                    </div>
                </div>
                {services.length > 1 && services.length - 1 !== index && <div className="horizontalLine"></div>}
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
                                <span>{filterType} </span>Service Ads
                                <span className="totalRows">- {(services.length < 10 ? '0' : '') + services.length}</span>
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
                            <p>Type</p>
                            <p>Rating</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{serviceElems}</div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedService && (
                    <div className="popupDiv addNewModelDiv">
                        <div className="popupContent">
                            <div className="form">
                                <h2 className="secondaryHeading">
                                    Service Ad <span>Details</span>
                                </h2>

                                <div className="rows">
                                    <div className="row">
                                        <div>ID</div>
                                        <div className="fw600">{selectedService._id}</div>
                                    </div>
                                    <div className="row">
                                        <div>Title</div>
                                        <div className="fw600">{selectedService.title}</div>
                                    </div>
                                    <div className="row">
                                        <div>Description</div>
                                        <div className="fw600">{selectedService.description}</div>
                                    </div>
                                    <div className="row">
                                        <div>Category</div>
                                        <div className="fw600">{selectedService.category}</div>
                                    </div>
                                    <div className="row">
                                        <div>SubCategory</div>
                                        <div className="fw600">{selectedService.subCategory}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Service <span>Details</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Service Price</div>
                                        <div className="fw600">${selectedService.servicePrice || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Service Type</div>
                                        <div className="fw600">{selectedService.serviceType || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Location & <span>Contact</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>City</div>
                                        <div className="fw600">{selectedService.city || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Neighbourhood</div>
                                        <div className="fw600">{selectedService.neighbourhood || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Phone</div>
                                        <div className="fw600">{selectedService.phone}</div>
                                    </div>
                                    <div className="row">
                                        <div>Show Phone</div>
                                        <div className="fw600">{selectedService.showPhone ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Engagement & <span>Status</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Rating</div>
                                        <div className="fw600">{selectedService.rating?.toFixed(1)} ({selectedService.reviewsCount} reviews)</div>
                                    </div>
                                    <div className="row">
                                        <div>Favorites</div>
                                        <div className="fw600">{selectedService.favoritesCount}</div>
                                    </div>
                                    <div className="row">
                                        <div>Created</div>
                                        <div className="fw600">{new Date(selectedService.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {selectedService.images && selectedService.images.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Service <span>Images</span>
                                        </h2>
                                        <div className="productImages">
                                            {selectedService.images.map((image, idx) => (
                                                <img key={idx} src={image} alt={`Service ${idx + 1}`} />
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
                    title="Delete Service Ad"
                    message="Are you sure you want to delete this service ad? This action cannot be undone."
                    onConfirm={handleDeleteService}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminServiceAds;