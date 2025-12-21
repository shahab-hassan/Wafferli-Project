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

function AdminExploreAds() {
    const [explores, setExplores] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedExplore, setSelectedExplore] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedExploreId, setSelectedExploreId] = useState(null);

    const searchTypeMap = {
        Title: 'title',
        ID: 'id',
        City: 'city'
    };

    useEffect(() => {
        fetchExplores();
    }, [filterType]);

    const fetchExplores = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/explore/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setExplores(response.data.ads);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchExplores();
    };

    const handleDeleteExplore = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/delete/${selectedExploreId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setExplores(explores.filter(e => e._id !== selectedExploreId));
                enqueueSnackbar('Explore ad deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete explore ad', { variant: 'error' });
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const openDetailsModal = (explore) => {
        setSelectedExplore(explore);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (exploreId) => {
        setSelectedExploreId(exploreId);
        setConfirmDialogOpen(true);
    };

    const exploreElems = explores.length > 0 ? (
        explores.map((explore, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field">
                        <p className="title">{explore.title}</p>
                    </div>
                    <p className="field">{explore.exploreName}</p>
                    <p className="field">{explore.seller?.name || explore.userId?.fullName || 'N/A'}</p>
                    <p className="field">
                        {explore.city || 'N/A'}
                    </p>
                    <p className="field">
                        {explore.startTime && explore.endTime
                            ? `${explore.startTime} - ${explore.endTime}`
                            : '24/7'}
                    </p>
                    <p className="ratingField field">{explore.rating?.toFixed(1) || '0.0'}</p>
                    <div className="actionsField field">
                        <FaEye
                            className="icon"
                            onClick={() => openDetailsModal(explore)}
                            title="View Details"
                        />
                        <FaTrash
                            className="icon delete"
                            onClick={() => openDeleteDialog(explore._id)}
                            title="Delete"
                        />
                        <MdOpenInNew
                            className="icon"
                            onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/explore/${explore._id}`, '_blank')}
                            title="Open in New Tab"
                        />
                    </div>
                </div>
                {explores.length > 1 && explores.length - 1 !== index && <div className="horizontalLine"></div>}
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
                                <span>{filterType} </span>Explore Ads
                                <span className="totalRows">- {(explores.length < 10 ? '0' : '') + explores.length}</span>
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
                            <p>Place Name</p>
                            <p>Added By</p>
                            <p>Location</p>
                            <p>Hours</p>
                            <p>Rating</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{exploreElems}</div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedExplore && (
                    <div className="popupDiv addNewModelDiv">
                        <div className="popupContent">
                            <div className="form">
                                <h2 className="secondaryHeading">
                                    Explore Ad <span>Details</span>
                                </h2>

                                <div className="rows">
                                    <div className="row">
                                        <div>ID</div>
                                        <div className="fw600">{selectedExplore._id}</div>
                                    </div>
                                    <div className="row">
                                        <div>Title</div>
                                        <div className="fw600">{selectedExplore.title}</div>
                                    </div>
                                    <div className="row">
                                        <div>Place Name</div>
                                        <div className="fw600">{selectedExplore.exploreName}</div>
                                    </div>
                                    <div className="row">
                                        <div>Description</div>
                                        <div className="fw600">{selectedExplore.description}</div>
                                    </div>
                                    <div className="row">
                                        <div>Explore Description</div>
                                        <div className="fw600">{selectedExplore.exploreDescription}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Hours & <span>Timing</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Opening Time</div>
                                        <div className="fw600">{selectedExplore.startTime || 'Always Open'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Closing Time</div>
                                        <div className="fw600">{selectedExplore.endTime || 'Always Open'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Location & <span>Contact</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>City</div>
                                        <div className="fw600">{selectedExplore.city || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Neighbourhood</div>
                                        <div className="fw600">{selectedExplore.neighbourhood || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Phone</div>
                                        <div className="fw600">{selectedExplore.phone}</div>
                                    </div>
                                    <div className="row">
                                        <div>Show Phone</div>
                                        <div className="fw600">{selectedExplore.showPhone ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Engagement & <span>Status</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Rating</div>
                                        <div className="fw600">{selectedExplore.rating?.toFixed(1)} ({selectedExplore.reviewsCount} reviews)</div>
                                    </div>
                                    <div className="row">
                                        <div>Favorites</div>
                                        <div className="fw600">{selectedExplore.favoritesCount}</div>
                                    </div>
                                    <div className="row">
                                        <div>Created</div>
                                        <div className="fw600">{new Date(selectedExplore.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {selectedExplore.images && selectedExplore.images.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Place <span>Images</span>
                                        </h2>
                                        <div className="productImages">
                                            {selectedExplore.images.map((image, idx) => (
                                                <img key={idx} src={image} alt={`Explore ${idx + 1}`} />
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
                    title="Delete Explore Ad"
                    message="Are you sure you want to delete this explore ad? This action cannot be undone."
                    onConfirm={handleDeleteExplore}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminExploreAds;