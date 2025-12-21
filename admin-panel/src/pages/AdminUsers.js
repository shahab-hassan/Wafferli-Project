import { useState, useEffect } from 'react';
import Dropdown from '../components/common/Dropdown';
import SearchInput from '../components/common/SearchInput';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../utils/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('email');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();

    const searchFilters = ['Email', 'Name', 'Phone'];
    const searchTypeMap = {
        Email: 'email',
        Name: 'name',
        Phone: 'phone'
    };

    useEffect(() => {
        fetchUsers();
    }, [filterType]);

    const fetchUsers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/users/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType, search: searchQuery }
                }
            );
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchUsers();
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/users/delete/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setUsers(users.filter(u => u._id !== userId));
                enqueueSnackbar('User deleted successfully!', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        }
    };

    const handleToggleVerification = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/users/toggle-verification/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                fetchUsers();
                enqueueSnackbar(
                    `User ${response.data.isVerified ? 'verified' : 'unverified'} successfully!`,
                    { variant: 'success' }
                );
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        }
    };

    const openConfirmDialog = (action, userId) => {
        setDialogAction(action);
        setSelectedUserId(userId);
        setConfirmDialogOpen(true);
    };

    const onConfirmAction = () => {
        if (dialogAction === 'delete') {
            handleDeleteUser(selectedUserId);
        } else if (dialogAction === 'toggleVerification') {
            handleToggleVerification(selectedUserId);
        }
        setConfirmDialogOpen(false);
    };

    const userElems = users.length > 0 ? (
        users.map((item, index) => (
            <div key={index}>
                <div className="requestRow row">
                    <div className="titleField field singleLineText">
                        <p className="title">{item.email}</p>
                    </div>
                    <p className="field">{item.fullName || 'N/A'}</p>
                    <p className="field">{item.phone}</p>
                    <p className="field">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</p>
                    <p className="statusField field">
                        <span className={`status ${item.isVerified ? 'verified' : 'unverified'}`}>
                            {item.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                    </p>
                    <p className="joinField field">{new Date(item.createdAt).toLocaleDateString()}</p>
                    <div className="actionsField field">
                        {item.isVerified ? (
                            <FaTimesCircle
                                style={{ color: 'var(--danger)' }}
                                className="icon"
                                onClick={() => openConfirmDialog('toggleVerification', item._id)}
                                title="Unverify User"
                            />
                        ) : (
                            <FaCheckCircle
                                style={{ color: 'var(--success)' }}
                                className="icon"
                                onClick={() => openConfirmDialog('toggleVerification', item._id)}
                                title="Verify User"
                            />
                        )}
                        <FaTrash
                            className="icon delete"
                            onClick={() => openConfirmDialog('delete', item._id)}
                            title="Delete User"
                        />
                    </div>
                </div>
                {users.length > 1 && users.length - 1 !== index && <div className="horizontalLine"></div>}
            </div>
        ))
    ) : (
        <div className="row">Nothing to show here...</div>
    );

    return (
        <div className='adminBuyersDiv'>
            <div className="adminBuyersContent">
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{filterType} </span>Users
                                <span className="totalRows">- {(users.length < 10 ? '0' : '') + users.length}</span>
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
                                    options={['All', 'Verified', 'Unverified', 'Sellers', 'Users']}
                                    onSelect={setFilterType}
                                    selected={filterType}
                                />
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Email</p>
                            <p>Full Name</p>
                            <p>Phone</p>
                            <p>Role</p>
                            <p>Status</p>
                            <p>Joined</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" />
                        ) : (
                            <div className="rows">{userElems}</div>
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    open={confirmDialogOpen}
                    title={
                        dialogAction === 'delete'
                            ? 'Delete User'
                            : 'Toggle User Verification'
                    }
                    message={
                        dialogAction === 'delete'
                            ? 'Are you sure you want to delete this user? This action cannot be undone.'
                            : 'Are you sure you want to change this user\'s verification status?'
                    }
                    onConfirm={onConfirmAction}
                    onCancel={() => setConfirmDialogOpen(false)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default AdminUsers;