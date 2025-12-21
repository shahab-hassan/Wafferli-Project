import { useEffect, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

function AdminSendEmailPopup({
    show,
    onClose,
    defaultRecipients,
    onSuccess,
}) {
    const [recipients, setRecipients] = useState({
        to: [],
        cc: [],
        bcc: []
    });
    const [currentRecipientType, setCurrentRecipientType] = useState('to');
    const [sendMethod, setSendMethod] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [buttons, setButtons] = useState([{ title: '', url: '' }]);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const addRecipient = () => {
        const newRecipientInput = document.getElementById('recipientInput').value.trim();

        if (!validateEmail(newRecipientInput)) {
            enqueueSnackbar('Invalid email address', { variant: 'error' });
            return;
        }

        const allCurrentEmails = [
            ...recipients.to,
            ...recipients.cc,
            ...recipients.bcc
        ];

        if (allCurrentEmails.includes(newRecipientInput)) {
            enqueueSnackbar('Email already added', { variant: 'warning' });
            return;
        }

        setRecipients(prev => ({
            ...prev,
            [currentRecipientType]: [...prev[currentRecipientType], newRecipientInput]
        }));

        document.getElementById('recipientInput').value = '';
    };

    const removeRecipient = (email, type) => {
        setRecipients(prev => ({
            ...prev,
            [type]: prev[type].filter(e => e !== email)
        }));
    };

    const moveAllRecipients = (fromType, toType) => {
        setRecipients(prev => {
            const emailsToMove = prev[fromType].filter(
                email => !prev[toType].includes(email)
            );

            return {
                ...prev,
                [fromType]: [],
                [toType]: [...prev[toType], ...emailsToMove]
            };
        });
    };

    useEffect(() => {
        if (show) {
            if (defaultRecipients) {
                setRecipients({
                    to: Array.isArray(defaultRecipients) ? defaultRecipients : [defaultRecipients],
                    cc: [],
                    bcc: []
                });
            }
            setSendMethod('');
            setSubject('');
            setMessage('');
            setButtons([{ title: '', url: '' }]);
        }
    }, [show, defaultRecipients]);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        if (sendMethod === 'manual') {
            if (!subject || !message) {
                enqueueSnackbar('Subject and Message are required!', { variant: 'error' });
                return;
            }

            for (let btn of buttons) {
                if (btn.title === '' || btn.url === '') {
                    enqueueSnackbar('Each button must have both a title and a URL!', { variant: 'error' });
                    return;
                }
            }
        } 
        else {
            enqueueSnackbar('Please choose a send method!', { variant: 'error' });
            return;
        }

        if (
            recipients.to.length === 0 &&
            recipients.cc.length === 0 &&
            recipients.bcc.length === 0
        ) {
            enqueueSnackbar('Please add at least one recipient!', { variant: 'error' });
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/send/email`, {
                recipients: {
                    to: recipients.to,
                    cc: recipients.cc,
                    bcc: recipients.bcc
                },
                subject: subject,
                message: message,
                buttons: sendMethod === 'manual' ? buttons : [],
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                },
            });

            enqueueSnackbar('Email(s) sent successfully!', { variant: 'success' });

            if (onSuccess) onSuccess();

            handleClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(
                error.response?.data?.error || 'Something went wrong.',
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose && onClose();
    };

    const addButton = () => {
        setButtons([...buttons, { title: '', url: '' }]);
    };

    const removeButton = (index) => {
        setButtons(buttons.filter((_, i) => i !== index));
    };

    if (!show) return null;

    const isSendEnabled =
        (sendMethod === 'manual' && subject && message)

    return (
        <div className="popupDiv adminSendEmailPopupDiv">
            <div className="popupContent form">
                <h2 className='secondaryHeading'>
                    Send <span>Email</span>
                </h2>

                <div className="horizontalLine"></div>

                <div className="recipientTypeDiv">

                    <div className="inputDiv recipientTypeDiv">
                        <h3 className='secondaryHeading'><span>Add</span> Recipients</h3>
                        <select
                            className="inputField dropdownLight"
                            value={currentRecipientType}
                            onChange={(e) => setCurrentRecipientType(e.target.value)}
                        >
                            <option value="to">To</option>
                            <option value="cc">CC</option>
                            <option value="bcc">BCC</option>
                        </select>
                    </div>

                    <div className="inputDiv recipientInputDiv">
                        <input
                            id="recipientInput"
                            type="email"
                            className="inputField recipientInput"
                            placeholder={`Enter ${currentRecipientType.toUpperCase()} email`}
                            onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                        />
                        <button
                            className="emailAddButton"
                            onClick={addRecipient}
                        >
                            <FaCheck />
                        </button>
                    </div>

                </div>

                {recipients.to.length > 0 && (
                    <div className="recipientPreview">
                        <div className="recipientHeader">
                            <h3 className='secondaryHeading'><span>TO</span> Recipients:</h3>
                            <div className="moveButtons">
                                <span onClick={() => moveAllRecipients('to', 'cc')}>Move All to CC</span> |
                                <span onClick={() => moveAllRecipients('to', 'bcc')}> Move All to BCC</span>
                            </div>
                        </div>
                        <div className="emailChipContainer">
                            {recipients.to.map(email => (
                                <div key={email} className="emailChip">
                                    {email}
                                    <button onClick={() => removeRecipient(email, 'to')}>
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recipients.cc.length > 0 && (
                    <div className="recipientPreview">
                        <div className="recipientHeader">
                            <h3 className='secondaryHeading'><span>CC</span> Recipients:</h3>
                            <div className="moveButtons">
                                <span onClick={() => moveAllRecipients('cc', 'to')}>Move All to TO</span> |
                                <span onClick={() => moveAllRecipients('cc', 'bcc')}> Move All to BCC</span>
                            </div>
                        </div>
                        <div className="emailChipContainer">
                            {recipients.cc.map(email => (
                                <div key={email} className="emailChip">
                                    {email}
                                    <button onClick={() => removeRecipient(email, 'cc')}>
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recipients.bcc.length > 0 && (
                    <div className="recipientPreview">
                        <div className="recipientHeader">
                            <h3 className='secondaryHeading'><span>BCC</span> Recipients:</h3>
                            <div className="moveButtons">
                                <span onClick={() => moveAllRecipients('bcc', 'to')}>Move All to TO</span> |
                                <span onClick={() => moveAllRecipients('bcc', 'cc')}> Move All to CC</span>
                            </div>
                        </div>
                        <div className="emailChipContainer">
                            {recipients.bcc.map(email => (
                                <div key={email} className="emailChip">
                                    {email}
                                    <button onClick={() => removeRecipient(email, 'bcc')}>
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="inputDiv">
                    <label>Send Method <span>*</span></label>
                    <select
                        className="inputField dropdownLight"
                        value={sendMethod}
                        onChange={(e) => {
                            setSendMethod(e.target.value);
                            setSubject('');
                            setMessage('');
                            setButtons([{ title: '', url: '' }]);
                        }}
                    >
                        <option value="">Select Send Method</option>
                        <option value="manual">Write Custom Email</option>
                    </select>
                </div>

                {sendMethod === 'manual' && (
                    <>
                        <div className="inputDiv">
                            <label htmlFor="subject">Subject <span>*</span></label>
                            <input
                                type="text"
                                name="subject"
                                className="inputField"
                                placeholder="Enter Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="message">Message <span>*</span></label>
                            <textarea
                                name="message"
                                className="inputField"
                                placeholder="Enter Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="buttonsSection inputDiv">
                            <div className='upper'>
                                <div>Buttons (Optional)</div>
                                <button
                                    type="button"
                                    className='addBtn secondaryBtn'
                                    onClick={addButton}
                                >
                                    Add Button
                                </button>
                            </div>
                            {buttons.map((button, index) => (
                                <div key={index} className="buttonInputDiv">
                                    <input
                                        type="text"
                                        className="inputField btnTitleInput"
                                        placeholder="Button Title"
                                        value={button.title}
                                        onChange={(e) => {
                                            const updated = [...buttons];
                                            updated[index].title = e.target.value;
                                            setButtons(updated);
                                        }}
                                    />
                                    <input
                                        type="url"
                                        className="inputField btnUrlInput"
                                        placeholder="Button URL"
                                        value={button.url}
                                        onChange={(e) => {
                                            const updated = [...buttons];
                                            updated[index].url = e.target.value;
                                            setButtons(updated);
                                        }}
                                    />
                                    <div className="removeBtnDiv">
                                        <IoIosCloseCircleOutline
                                            className='removeBtn'
                                            onClick={() => removeButton(index)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="buttonsDiv">
                    <button
                        type="button"
                        className="secondaryBtn"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                        className="primaryBtn"
                        onClick={handleSendEmail}
                        disabled={!isSendEnabled || loading}
                    >
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminSendEmailPopup;