import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

function ConfirmDialog({ open, title, message, onConfirm, onCancel, isLoading }) {
    if (!open) return null;

    return (
        <div className="confirmDialogOverlay">
            <div className="confirmDialogContent">
                <FaExclamationCircle className="confirmIcon" />
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="dialogButtons">
                    <button
                        className="primaryBtn"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Yes
                    </button>
                    <button
                        className="primaryBtn2"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
