import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAdminLogin, setIsAdminLogin] = useState(null);
    const [admin, setAdmin] = useState(null);
    const isTabletPro = window.innerWidth <= 1024;

    const fetchAdminData = async () => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admins/admin/checkAdminLogin`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.isLogin) {
                    setIsAdminLogin(true);
                    setAdmin(response.data.admin);
                } else {
                    setIsAdminLogin(false);
                    setAdmin(null);
                }
            } catch (error) {
                setIsAdminLogin(false);
                setAdmin(null);
            }
        }
        else {
            setIsAdminLogin(false);
            setAdmin(null);
        }
    };

    useEffect(() => {

        if (localStorage.getItem('loggedOut')) {
            enqueueSnackbar("Logged out Successfully!", { variant: "success" });
            localStorage.removeItem('loggedOut');
        }

        fetchAdminData();

    }, []);

    const adminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminLogin(true);
        fetchAdminData();
        localStorage.removeItem('token');
    };

    const adminLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.setItem("loggedOut", 'true');
            window.location.href = "/login";
            localStorage.removeItem('adminToken');
            setIsAdminLogin(false);
            setAdmin(null);
        }
    };


    return (
        <AuthContext.Provider value={{ adminLogout, fetchAdminData, adminLogin, isAdminLogin, admin, isTabletPro }}>
            {children}
        </AuthContext.Provider>
    );
};
