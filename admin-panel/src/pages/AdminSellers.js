import { useState, useEffect } from 'react';
import Dropdown from '../components/common/Dropdown';
import SearchInput from '../components/common/SearchInput';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaBriefcase, FaUser } from 'react-icons/fa';
import Loader from '../utils/Loader';

function AdminSellers() {
    const [sellers, setSellers] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('email');

    const searchFilters = ['Email', 'Name'];
    const searchTypeMap = {
        Email: 'email',
        Name: 'name',
    };

    useEffect(() => {
        fetchSellers();
    }, [filterType]);

    const fetchSellers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/sellers/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setSellers(response.data.sellers);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchSellers();
    };

    const sellerElems = sellers.length > 0 ? (
        sellers.map((item, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field singleLineText">
                        <p className="title">{item.userId?.email}</p>
                    </div>
                    <p className="field">{item.name || item.userId?.fullName || 'N/A'}</p>
                    <p className="typeField field">
                        {item.businessType === 'business' ? (
                            <span className="badge business">
                                <FaBriefcase /> Business
                            </span>
                        ) : (
                            <span className="badge individual">
                                <FaUser /> Individual
                            </span>
                        )}
                    </p>
                    <p className="field">{item.totalAds || 0}</p>
                    <p className="joinField field">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                {sellers.length > 1 && sellers.length - 1 !== index && <div className="horizontalLine"></div>}
            </div>
        ))
    ) : (
        <div className="row">Nothing to show here...</div>
    );

    return (
        <div className="adminSellersDiv">
            <div className="adminSellersContent">
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{filterType} </span>Sellers
                                <span className="totalRows">- {(sellers.length < 10 ? '0' : '') + sellers.length}</span>
                            </h2>
                            <div className="upperRight">
                                <SearchInput
                                    searchType={searchType}
                                    setSearchType={setSearchType}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    searchFilters={searchFilters}
                                    searchTypeMap={searchTypeMap}
                                    placeholder={`Search by ${searchType}`}
                                    onSearch={handleSearch}
                                />
                                <Dropdown
                                    options={['All', 'Business', 'Individual']}
                                    onSelect={setFilterType}
                                    selected={filterType}
                                />
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Email</p>
                            <p>Name</p>
                            <p>Type</p>
                            <p>Total Ads</p>
                            <p>Joined</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{sellerElems}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSellers;