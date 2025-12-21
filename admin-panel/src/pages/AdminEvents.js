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

function AdminEventAds() {
    const [events, setEvents] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const searchTypeMap = {
        Title: 'title',
        ID: 'id',
        Type: 'type'
    };

    useEffect(() => {
        fetchEvents();
    }, [filterType]);

    const fetchEvents = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/events/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setEvents(response.data.ads);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchEvents();
    };

    const handleDeleteEvent = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/ads/delete/${selectedEventId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setEvents(events.filter(e => e._id !== selectedEventId));
                enqueueSnackbar('Event ad deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete event ad', { variant: 'error' });
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const openDetailsModal = (event) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (eventId) => {
        setSelectedEventId(eventId);
        setConfirmDialogOpen(true);
    };

    const eventElems = events.length > 0 ? (
        events.map((event, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field">
                        <p className="title">{event.title}</p>
                    </div>
                    <p className="field">{event.seller?.name || event.userId?.fullName || 'N/A'}</p>
                    <p className="field">{event.eventType}</p>
                    <p className="field">
                        {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="field">{event.eventTime} - {event.endTime}</p>
                    <p className="field">{event.city || 'N/A'}</p>
                    <p className="ratingField field">{event.rating?.toFixed(1) || '0.0'}</p>
                    <div className="actionsField field">
                        <FaEye
                            className="icon"
                            onClick={() => openDetailsModal(event)}
                            title="View Details"
                        />
                        <FaTrash
                            className="icon delete"
                            onClick={() => openDeleteDialog(event._id)}
                            title="Delete"
                        />
                        <MdOpenInNew
                            className="icon"
                            onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/events/${event._id}`, '_blank')}
                            title="Open in New Tab"
                        />
                    </div>
                </div>
                {events.length > 1 && events.length - 1 !== index && <div className="horizontalLine"></div>}
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
                                <span>{filterType} </span>Event Ads
                                <span className="totalRows">- {(events.length < 10 ? '0' : '') + events.length}</span>
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
                            <p>Organizer</p>
                            <p>Event Type</p>
                            <p>Date</p>
                            <p>Time</p>
                            <p>City</p>
                            <p>Rating</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{eventElems}</div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedEvent && (
                    <div className="popupDiv addNewModelDiv">
                        <div className="popupContent">
                            <div className="form">
                                <h2 className="secondaryHeading">
                                    Event Ad <span>Details</span>
                                </h2>

                                <div className="rows">
                                    <div className="row">
                                        <div>ID</div>
                                        <div className="fw600">{selectedEvent._id}</div>
                                    </div>
                                    <div className="row">
                                        <div>Title</div>
                                        <div className="fw600">{selectedEvent.title}</div>
                                    </div>
                                    <div className="row">
                                        <div>Description</div>
                                        <div className="fw600">{selectedEvent.description}</div>
                                    </div>
                                    <div className="row">
                                        <div>Event Type</div>
                                        <div className="fw600">{selectedEvent.eventType}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Event <span>Schedule</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Event Date</div>
                                        <div className="fw600">{new Date(selectedEvent.eventDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="row">
                                        <div>Start Time</div>
                                        <div className="fw600">{selectedEvent.eventTime}</div>
                                    </div>
                                    <div className="row">
                                        <div>End Time</div>
                                        <div className="fw600">{selectedEvent.endTime}</div>
                                    </div>
                                </div>

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Location & <span>Contact</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>City</div>
                                        <div className="fw600">{selectedEvent.city || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Neighbourhood</div>
                                        <div className="fw600">{selectedEvent.neighbourhood || 'N/A'}</div>
                                    </div>
                                    <div className="row">
                                        <div>Phone</div>
                                        <div className="fw600">{selectedEvent.phone}</div>
                                    </div>
                                    <div className="row">
                                        <div>Show Phone</div>
                                        <div className="fw600">{selectedEvent.showPhone ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>

                                {selectedEvent.featuresAmenities && selectedEvent.featuresAmenities.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Features & <span>Amenities</span>
                                        </h2>
                                        <div className="rows">
                                            {selectedEvent.featuresAmenities.map((feature, idx) => (
                                                <div key={idx} className="row">
                                                    <div className="fw600">• {feature}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="horizontalLine"></div>

                                <h2 className="secondaryHeading">
                                    Engagement & <span>Status</span>
                                </h2>
                                <div className="rows">
                                    <div className="row">
                                        <div>Rating</div>
                                        <div className="fw600">{selectedEvent.rating?.toFixed(1)} ({selectedEvent.reviewsCount} reviews)</div>
                                    </div>
                                    <div className="row">
                                        <div>Favorites</div>
                                        <div className="fw600">{selectedEvent.favoritesCount}</div>
                                    </div>
                                    <div className="row">
                                        <div>Created</div>
                                        <div className="fw600">{new Date(selectedEvent.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {selectedEvent.images && selectedEvent.images.length > 0 && (
                                    <>
                                        <div className="horizontalLine"></div>
                                        <h2 className="secondaryHeading">
                                            Event <span>Images</span>
                                        </h2>
                                        <div className="productImages">
                                            {selectedEvent.images.map((image, idx) => (
                                                <img key={idx} src={image} alt={`Event ${idx + 1}`} />
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
                    title="Delete Event Ad"
                    message="Are you sure you want to delete this event ad? This action cannot be undone."
                    onConfirm={handleDeleteEvent}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminEventAds;