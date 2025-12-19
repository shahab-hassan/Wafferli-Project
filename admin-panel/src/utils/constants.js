import { FaComments, FaPhoneAlt, FaQuestionCircle, FaRegFileAlt, FaVideo } from "react-icons/fa";

export const states = [
    { name: "Alberta", tax: 5 },
    { name: "British Columbia", tax: 12 },
    { name: "Manitoba", tax: 12 },
    { name: "New Brunswick", tax: 15 },
    { name: "Newfoundland and Labrador", tax: 15 },
    { name: "Northwest Territories", tax: 5 },
    { name: "Nova Scotia", tax: 15 },
    { name: "Nunavut", tax: 5 },
    { name: "Ontario", tax: 13 },
    { name: "Quebec", tax: 15 },
    { name: "Prince Edward Island", tax: 15 },
    { name: "Saskatchewan", tax: 11 },
    { name: "Yukon", tax: 5 },
];


export const typeConfig = {
    "Service Order": {
        label: "Service Package",
        icon: <FaRegFileAlt />
    },
    "Video Call Order": {
        label: "Video Session",
        icon: <FaVideo />
    },
    "Audio Call Order": {
        label: "Audio Call",
        icon: <FaPhoneAlt />
    },
    "Chat Now Order": {
        label: "Live Chat",
        icon: <FaComments />
    },
    "Questions and Answer Order": {
        label: "Q&A Session",
        icon: <FaQuestionCircle />
    }
};

export const formatDuration = (hours, minutes) => {
    const parts = [];

    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    }

    return parts.length ? parts.join(', ') : '';
}

export const convertSecondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const crrDate = new Date();
crrDate.setDate(crrDate.getDate());
export const today = crrDate.toISOString().split('T')[0];
crrDate.setDate(crrDate.getDate() + 1);
export const tommorrow = crrDate.toISOString().split('T')[0];