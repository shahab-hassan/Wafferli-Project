import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import Loader from '../utils/Loader';
import AdminSendEmailPopup from '../components/admin/AdminSendEmailPopup';
import { IoIosCloseCircleOutline } from 'react-icons/io';

function AdminEmail() {
    const [emails, setEmails] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showAddEmailPopup, setShowAddEmailPopup] = useState(false);
    const [pendingEmails, setPendingEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const token = localStorage.getItem('adminToken');
    const [newEmailInput, setNewEmailInput] = useState('');

    useEffect(() => {
        const fetchAllEmails = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/emails`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEmails(data.emails || []);
            } catch (err) {
                enqueueSnackbar(
                    err?.response?.data?.error || 'Failed to fetch emails',
                    { variant: 'error' }
                );
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchAllEmails();
    }, [token]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const addEmailsFromInput = () => {
        // Split input by comma or space and trim
        const inputEmails = newEmailInput
            .split(/[,\s]+/)
            .map(email => email.trim())
            .filter(email => email !== '');

        const validEmails = inputEmails.filter(validateEmail);
        const invalidEmails = inputEmails.filter(email => !validateEmail(email));

        // Add only valid, non-duplicate emails
        const newValidEmails = validEmails.filter(
            email => !pendingEmails.includes(email) && !emails.includes(email)
        );

        if (newValidEmails.length > 0) {
            setPendingEmails(prev => [...new Set([...prev, ...newValidEmails])]);
            setNewEmailInput('');
        }

        if (invalidEmails.length > 0) {
            enqueueSnackbar(`Invalid emails: ${invalidEmails.join(', ')}`, { variant: 'warning' });
        }
    };

    const handleEmailInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEmailsFromInput();
        }
    };


    const handleCheckboxChange = (email) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(selectedEmails.filter((e) => e !== email));
        } else {
            setSelectedEmails([...selectedEmails, email]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmails(emails);
        } else {
            setSelectedEmails([]);
        }
    };

    const openPopup = () => {
        if (selectedEmails.length === 0) {
            enqueueSnackbar('Please select at least one email', { variant: 'warning' });
            return;
        }
        setShowPopup(true);
    };

    const handleDeleteEmail = async (emailToDelete) => {
        try {
            setIsDeleting(true);
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/emails/delete`,
                { email: emailToDelete },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEmails(emails.filter(email => email !== emailToDelete));
            setSelectedEmails(selectedEmails.filter(email => email !== emailToDelete));
            enqueueSnackbar('Email deleted successfully', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(
                err?.response?.data?.message || 'Failed to delete email',
                { variant: 'error' }
            );
        }
        finally {
            setIsDeleting(false);
        }
    };

    const handleAddEmails = async () => {
        try {
            setIsAdding(true);
            const validEmails = pendingEmails.filter(validateEmail);

            if (validEmails.length === 0) {
                enqueueSnackbar('No valid emails to add', { variant: 'warning' });
                return;
            }

            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/emails/add`,
                { emails: validEmails },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEmails(prev => [...new Set([...prev, ...data.addedEmails])]);
            setPendingEmails([]);
            setShowAddEmailPopup(false);
            enqueueSnackbar(`Added ${validEmails.length} email(s)`, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(
                err?.response?.data?.message || 'Failed to add emails',
                { variant: 'error' }
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handlePasteEmails = (e) => {
        const pastedText = e.clipboardData.getData('text');

        const extractedEmails = pastedText
            .split(/[\s,;]+/)
            .map(email => email.trim())
            .filter(email => validateEmail(email));

        const uniqueNewEmails = extractedEmails.filter(
            email => !pendingEmails.includes(email) && !emails.includes(email)
        );

        setPendingEmails(prev => [...new Set([...prev, ...uniqueNewEmails])]);
    };

    const isAllSelected = emails.length > 0 && selectedEmails.length === emails.length;

    return (
        <div className="adminEmailsDiv tableDiv">
            {(isDeleting || isAdding) && <Loader type="checkmate" />}
            <div className="tableContent">

                <div className="upper">
                    <h2 className="secondaryHeading">Manage <span>Emails</span></h2>
                    <div className="upperRight">
                        <button
                            className='secondaryBtn'
                            onClick={() => setShowAddEmailPopup(true)}
                        >
                            Add Emails
                        </button>
                        <button
                            className='secondaryBtn'
                            disabled={selectedEmails.length === 0}
                            onClick={openPopup}
                        >
                            Send Email
                        </button>
                    </div>
                </div>
                <div className="header">
                    <p style={{ width: '10%' }}>
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            disabled={emails.length === 0}
                        />
                    </p>
                    <p style={{ width: '80%', textAlign: "start" }}>Email</p>
                    <p style={{ width: '10%', textAlign: "center" }}>Actions</p>
                </div>

                {isLoading ? <Loader type="simpleMini" /> : <div className="rows">
                    {emails.map((email, index) => (
                        <div key={email}>
                            <div className="row">
                                <div className="field selectCol" style={{ width: '10%' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEmails.includes(email)}
                                        onChange={() => handleCheckboxChange(email)}
                                    />
                                </div>
                                <div className="field emailCol emailField" style={{ width: '80%', justifyContent: 'start' }}>
                                    {email}
                                </div>
                                <div className="field" style={{ width: '10%', justifyContent: 'center' }}>
                                    <button
                                        className="iconBtn"
                                        onClick={() => handleDeleteEmail(email)}
                                        title="Delete Email"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                            {index < emails.length - 1 && <div className="horizontalLine"></div>}
                        </div>
                    ))}
                    {emails.length === 0 && (
                        <div className="row">
                            <div className="field noEmails">
                                No emails found
                            </div>
                        </div>
                    )}
                </div>}
            </div>

            <AdminSendEmailPopup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                defaultRecipients={selectedEmails}
                showButtons={true}
            />

            {showAddEmailPopup && (
                <div className="popupDiv">
                    <div className="popupContent form adminEmailsPopupContent">
                        <h3 className='secondaryHeading'>Add New Emails</h3>

                        <div className="inputDiv emailInputContainer">
                            <input
                                type="text"
                                placeholder="Enter email(s)"
                                value={newEmailInput}
                                onChange={(e) => setNewEmailInput(e.target.value)}
                                onKeyDown={handleEmailInputKeyDown}
                                onPaste={handlePasteEmails}
                                className="inputField emailInput"
                            />
                            <button
                                className="emailAddButton"
                                onClick={addEmailsFromInput}
                                disabled={!newEmailInput.trim()}
                            >
                                <FaCheck />
                            </button>
                        </div>

                        {pendingEmails.length > 0 && (
                            <div className="pendingEmailsPreview">
                                <p>Pending Emails:</p>
                                <div className="emailChipContainer">
                                    {pendingEmails.map(email => (
                                        <div key={email} className="emailChip">
                                            {email}
                                            <button
                                                onClick={() => setPendingEmails(
                                                    pendingEmails.filter(e => e !== email)
                                                )}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="buttonsDiv">
                            <button
                                className='secondaryBtn'
                                onClick={() => {setShowAddEmailPopup(false); setPendingEmails([]); setNewEmailInput('')}}
                            >
                                Cancel
                            </button>
                            <button
                                className="primaryBtn"
                                onClick={handleAddEmails}
                                disabled={pendingEmails.length === 0}
                            >
                                Add {pendingEmails.length} Email{pendingEmails.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                    <div className="popupCloseBtn">
                        <IoIosCloseCircleOutline
                            className="icon"
                            onClick={() => {setShowAddEmailPopup(false); setPendingEmails([]); setNewEmailInput('')}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEmail;