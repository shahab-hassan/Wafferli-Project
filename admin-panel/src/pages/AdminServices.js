import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Link } from "react-router-dom";
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MdOpenInNew } from "react-icons/md";
import Dropdown from '../components/common/Dropdown';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from "../utils/Loader";
import SearchInput from '../components/common/SearchInput';

function AdminServices({ pre }) {
    const [services, setServices] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [filteredServices, setFilteredServices] = useState([]);
    const [showServiceDetailsModel, setShowServiceDetailsModel] = useState(false);
    const [openedService, setOpenedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const serviceFilters = ["All", "Discounted", "Boosted", "HighRated", "TopSelling"];

    const [searchQuery, setSearchQuery] = useState("")
    const [searchType, setSearchType] = useState("title")
    const searchFilters = ["Title", "ID", "Seller"]
    const searchTypeMap = {
        Title: "title",
        ID: "id",
        "Seller": "seller",
    }

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/services/all/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setServices(response.data.allServices);
            }
        } catch (e) {
            // enqueueSnackbar(e.response?.data?.error || 'Failed to fetch services', { variant: 'error' });
        }
        setLoading(false);
    };

    useEffect(() => {
        let filtered = services;
        if (filterType === 'All') {
            setFilteredServices(services);
        } else {
            switch (filterType) {
                case 'Discounted':
                    filtered = services.filter(service => service.discountPercent > 0);
                    break;
                case 'Boosted':
                    filtered = services.filter(service => service.boostExpiryDate && new Date(service.boostExpiryDate) > new Date());
                    break;
                case 'HighRated':
                    filtered = services.filter(service => service.rating >= 4.5);
                    break;
                case 'TopSelling':
                    filtered = services.filter(service => service.sold >= 50);
                    break;
                default:
                    filtered = services;
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            switch (searchType) {
                case "title":
                    filtered = filtered.filter((product) => product.title.toLowerCase().includes(query))
                    break
                case "id":
                    filtered = filtered.filter((product) => product._id.toLowerCase().includes(query))
                    break
                case "seller":
                    filtered = filtered.filter((product) => product.sellerId?.userId?.username.toLowerCase().includes(query))
                    break
                default:
                    break
            }
        }
        setFilteredServices(filtered);

    }, [filterType, searchQuery, searchType, services]);

    const handleOpenServiceDetails = (service) => {
        setOpenedService(service);
        setShowServiceDetailsModel(true);
    };

    const handleDeleteService = (serviceId) => {
        setConfirmDialog({
            open: true,
            title: 'Delete Service',
            message: 'Are you sure you want to delete this service? This action cannot be undone.',
            onConfirm: () => confirmDeleteService(serviceId)
        });
    };

    const confirmDeleteService = async (serviceId) => {
        setDeleteLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/services/seller/service/${serviceId}`,
                { headers: { Authorization: `Admin ${token}` } }
            );
            if (response.data.success) {
                setServices(services.filter(service => service._id !== serviceId));
                enqueueSnackbar('Service deleted successfully', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Failed to delete service', { variant: 'error' });
        }
        setDeleteLoading(false);
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const serviceElems = loading ? <Loader type="simpleMini" /> : filteredServices.length > 0 ? filteredServices.map((service, index) => (
        <div key={index} className="requestRow row">
            <div className="titleField field">
                <p className="title">{service.title}</p>
            </div>
            <Link to={`/sellers/${service.sellerId?._id}`} className="sellerField field">
                {service.sellerId?.userId?.username + " >"}
            </Link>
            <p className="field">{service.category}</p>
            <p className="priceField field">
                ${service.packages[0]?.salesPrice || 'N/A'}
            </p>
            <p className="ratingField field">{service.rating.toFixed(1)}</p>
            <p className="soldField field">{service.sold}</p>
            <div className="actionsField field">
                <FaEye className="icon" onClick={() => handleOpenServiceDetails(service)} />
                <FaTrash className="icon delete" onClick={() => handleDeleteService(service._id)} />
                <MdOpenInNew className='icon' onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/postingDetails/` + service._id, '_blank')} />
            </div>
        </div>
    )) : <div className="row">Nothing to show here...</div>;

    return (
        <div className='adminServicesDiv'>
            <div className='adminServicesContent'>
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{pre === "dashboard" ? "Services" : filterType} </span>
                                {pre === "dashboard" ? "Management" : "Services"}
                            </h2>
                            <div className="upperRight">
                                <SearchInput
                                    searchType={searchType}
                                    setSearchType={setSearchType}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    searchFilters={searchFilters}
                                    searchTypeMap={searchTypeMap}
                                    placeholder={`Search by ${searchType === "id" ? "ID" : searchType === "seller" ? "Seller Username" : "Title"}`}
                                />
                                <Dropdown
                                    options={serviceFilters}
                                    selected={filterType}
                                    onSelect={setFilterType}
                                />
                                {pre === "dashboard" &&
                                    <Link to="/services" className='secondaryBtn'>
                                        View All {">"}
                                    </Link>
                                }
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Title</p>
                            <p>Seller</p>
                            <p>Category</p>
                            <p>Basic Price</p>
                            <p>Rating</p>
                            <p>Sold</p>
                            <p>Actions</p>
                        </div>
                        <div className="rows">{serviceElems}</div>
                    </div>
                </div>
            </div>

            {showServiceDetailsModel && (
                <div className="popupDiv addNewModelDiv">
                    <div className="popupContent">
                        <div className='form'>
                            <h2 className="secondaryHeading">Service <span>Details</span></h2>

                            <div className="rows">
                                <div className="row">
                                    <div>ID</div>
                                    <div className="fw600">{openedService._id}</div>
                                </div>
                                <div className="row">
                                    <div>Title</div>
                                    <div className="fw600">{openedService.title}</div>
                                </div>
                                <div className="row">
                                    <div>Description</div>
                                    <div className="fw600">{openedService.description}</div>
                                </div>
                                <div className="row">
                                    <div>Category</div>
                                    <div className="fw600">{openedService.category}</div>
                                </div>
                                <div className="row">
                                    <div>Tags</div>
                                    <div className="fw600">{openedService.tags.join(', ')}</div>
                                </div>
                            </div>

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">Packages</h2>
                            {openedService.packages.map((pkg, index) => (
                                <div key={index} className="packageSection">
                                    <h3>{pkg.name}</h3>
                                    <div className="rows">
                                        <div className="row">
                                            <div>Title</div>
                                            <div className="fw600">{pkg.title}</div>
                                        </div>
                                        <div className="row">
                                            <div>Description</div>
                                            <div className="fw600">{pkg.description}</div>
                                        </div>
                                        <div className="row">
                                            <div>Base Price</div>
                                            <div className="fw600">${pkg.price}</div>
                                        </div>
                                        <div className="row">
                                            <div>Sales Price</div>
                                            <div className="fw600">${pkg.salesPrice}</div>
                                        </div>
                                        <div className="row">
                                            <div>Delivery Days</div>
                                            <div className="fw600">{pkg.deliveryDays} days</div>
                                        </div>
                                        <div className="row">
                                            <div>Seller Earnings</div>
                                            <div className="fw600">${pkg.amountToGet}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">Performance <span>Metrics</span></h2>
                            <div className="rows">
                                <div className="row">
                                    <div>Units Sold</div>
                                    <div className="fw600">{openedService.sold}</div>
                                </div>
                                <div className="row">
                                    <div>Rating</div>
                                    <div className="fw600">{openedService.rating.toFixed(1)} ({openedService.noOfReviews} reviews)</div>
                                </div>
                                {openedService.discountPercent > 0 && (
                                    <>
                                        <div className="row">
                                            <div>Discount</div>
                                            <div className="fw600">{openedService.discountPercent}%</div>
                                        </div>
                                        <div className="row">
                                            <div>Discount Expiry</div>
                                            <div className="fw600">
                                                {new Date(openedService.discountExpiryDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {openedService.boostExpiryDate && (
                                    <div className="row">
                                        <div>Boost Status</div>
                                        <div className="fw600">
                                            Boosted until {new Date(openedService.boostExpiryDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">Service <span>Images</span></h2>
                            <div className="serviceImages">
                                {openedService.serviceImages.map((image, index) => (
                                    <img key={index} src={image} alt={`Service ${index + 1}`} />
                                ))}
                            </div>

                            <div className="buttonsDiv">
                                <button
                                    className="secondaryBtn"
                                    type="button"
                                    onClick={() => setShowServiceDetailsModel(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="popupCloseBtn">
                        <IoIosCloseCircleOutline
                            className="icon"
                            onClick={() => setShowServiceDetailsModel(false)}
                        />
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
                isLoading={deleteLoading}
            />
        </div>
    );
}

export default AdminServices;