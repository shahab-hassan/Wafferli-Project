import React, { useState, useEffect } from 'react'
import Dropdown from '../components/common/Dropdown';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaEnvelope, FaLock, FaLockOpen } from 'react-icons/fa';
import { MdChat } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import AdminSendEmailPopup from '../components/admin/AdminSendEmailPopup';
import Loader from '../utils/Loader'; // Import Loader
import ConfirmDialog from '../components/common/ConfirmDialog'; // Import ConfirmDialog

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedUserId, setSelectedUserId] = useState(null); // State for selected user ID
    const [selectedUserBlockStatus, setSelectedUserBlockStatus] = useState(false); // State for selected user block status
    const navigate = useNavigate();
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [selectedBuyerEmail, setSelectedBuyerEmail] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true); // Start loading
            const token = localStorage.getItem('adminToken');
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/all/`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filterType }
                });
                if (response.data.success) {
                    const sortedUsers = response.data.allUsers.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );
                    setUsers(sortedUsers);
                }
            } catch (e) {
                enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
            } finally {
                setIsLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchUsers();
    }, [filterType, isUpdated]);

    const handleSendEmail = (user) => {
        setSelectedBuyerEmail(user.email);
        setShowEmailPopup(true);
    };

    const handleBlockUser = async (userId, isBlocked) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/block/`,
                { userId, isBlocked },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setIsUpdated(prev => !prev)
                enqueueSnackbar(isBlocked ? "User has been UnBlocked!" : 'User has been blocked!', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || 'Something went wrong!', { variant: 'error' });
        }
    };

    const handleConfirmBlockUser = (userId, isBlocked) => {
        setSelectedUserId(userId);
        setSelectedUserBlockStatus(isBlocked);
        setConfirmDialogOpen(true);
    };

    const onConfirmAction = () => {
        handleBlockUser(selectedUserId, selectedUserBlockStatus);
        setConfirmDialogOpen(false);
    };

    const onCancelAction = () => {
        setConfirmDialogOpen(false);
    };

    const userElems = users.length > 0 ? users.map((item, index) => (
        <div key={index}>
            <div className="requestRow row">
                <div className="titleField field">
                    <p className="title">{item.email}</p>
                </div>
                <p className="usernameField field">{item.username}</p>
                <p className="statusField field">{item.userStatus}</p>
                <p className="joinField field">{new Date(item?.createdAt).toLocaleDateString()}</p>
                <div className="actionsField field">
                    <MdChat className="icon" onClick={() => navigate(`/chats/?p=${item?._id}`)} />
                    <FaEnvelope className="icon"
                        onClick={() => handleSendEmail(item)}
                    />
                    {item.userStatus === 'Blocked' ?
                        <FaLockOpen style={{ color: "var(--success)" }} className="icon" onClick={() => handleConfirmBlockUser(item._id, true)} />
                        :
                        <FaLock style={{ color: "var(--danger)" }} className="icon" onClick={() => handleConfirmBlockUser(item._id, false)} />
                    }
                </div>
            </div>
            {users.length > 1 && users.length - 1 !== index && <div className="horizontalLine"></div>}
        </div >
    ))
        : <div className="row">Nothing to show here...</div>;

    return (
        <div className='adminBuyersDiv'>
            <div className="adminBuyersContent">
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{filterType} </span>Users
                                <span className="totalRows">- {(users.length < 10 && '0') + users.length}</span>
                            </h2>
                            <div className="upperRight">
                                <Dropdown options={["All", "Active", "Blocked"]} onSelect={setFilterType} selected={filterType} />
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Email</p>
                            <p>Username</p>
                            <p>Status</p>
                            <p>Member Since</p>
                            <p>Actions</p>
                        </div>
                        {isLoading ? (
                            <Loader type="simpleMini" /> // Show loader while loading
                        ) : (
                            <div className="rows">{userElems}</div>
                        )}
                    </div>
                </div>

                <AdminSendEmailPopup
                    show={showEmailPopup}
                    onClose={() => setShowEmailPopup(false)}
                    defaultRecipients={selectedBuyerEmail ? [selectedBuyerEmail] : []}
                    showButtons={true}
                />

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    open={confirmDialogOpen}
                    title={selectedUserBlockStatus ? 'Unblock User' : 'Block User'}
                    message={
                        selectedUserBlockStatus
                            ? 'Are you sure you want to unblock this user?'
                            : 'Are you sure you want to block this user?'
                    }
                    onConfirm={onConfirmAction}
                    onCancel={onCancelAction}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default AdminUsers