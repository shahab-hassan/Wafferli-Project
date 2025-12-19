import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import MobileRestricted from './MobileRestricted';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminLogin, admin, isTabletPro } = useContext(AuthContext);
  const location = useLocation();

  if (isTabletPro) return <MobileRestricted />;

  if (isAdminLogin === null) return null;

  if (!isAdminLogin) return <Navigate to="/login" replace />;

  const normalizePageName = (path) => {
    const pageMap = {
      emails: 'Email Campaigns',
      terms: 'Terms & Conditions',
      social: 'Social Links',
      faq: 'Information Center'
    };

    const basePath = path.split('/')[0];

    return pageMap[basePath] || basePath.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const hasAccess = (path) => {
    if (admin?.role === 'Super Admin') return true;

    if (admin?.role === 'Admin') return path !== '/employees';

    if (admin?.role === 'Moderator') {
      const page = normalizePageName(path);
      return admin?.access[page] !== undefined;
    }

    return false;
  };

  if (!hasAccess(location.pathname)) {
    const defaultPage = admin?.access ? (Object.keys(admin?.access)[0]?.toLowerCase()) : '';
    return <Navigate to={`/${defaultPage}`} replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminProtectedRoute;