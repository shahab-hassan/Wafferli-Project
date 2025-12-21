import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import MobileRestricted from './MobileRestricted';
import Loader from '../utils/Loader';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminLogin, admin, isTabletPro } = useContext(AuthContext);
  const location = useLocation();

  if (isTabletPro) return <MobileRestricted />;

  if (isAdminLogin === null) return null;

  if (!isAdminLogin) return <Navigate to="/login" replace />;

  if (isAdminLogin && !admin)
    return <Loader type={"checkmate"} />;

  const getPageKeyFromPath = (path) => {
    const slug = path.split('/').filter(Boolean)[0];
    if (!slug) return 'Dashboard';

    const map = {
      'dashboard': 'Dashboard',
      'users': 'Users',
      'sellers': 'Sellers',
      'product-ads': 'Product Ads',
      'service-ads': 'Service Ads',
      'explore-ads': 'Explore Ads',
      'offer-ads': 'Offer Ads',
      'event-ads': 'Event Ads',
      'blogs': 'Blogs',
      'terms-policy': 'Terms & Policy',
      'faq': 'FAQ',
      'emails': 'Email Campaigns',
      'employees': 'Employees'
    };

    return map[slug] || slug;
  };

  const getSlugFromPageKey = (key) => {
    const reverseMap = {
      'Dashboard': '',
      'Product Ads': 'product-ads',
      'Service Ads': 'service-ads',
      'Explore Ads': 'explore-ads',
      'Offer Ads': 'offer-ads',
      'Event Ads': 'event-ads',
      'Terms & Policy': 'terms-policy',
      'Email Campaigns': 'emails',
    };

    return reverseMap[key] || key.toLowerCase().replace(/\s+/g, '-');
  };

  const hasAccess = () => {
    const pageKey = getPageKeyFromPath(location.pathname);

    if (admin?.role === 'Super Admin') return true;

    if (admin?.role === 'Admin') {
      return pageKey !== 'Employees';
    }

    if (admin?.role === 'Moderator') {
      if (pageKey === 'Employees') return false;
      return admin?.access && admin.access[pageKey] !== undefined;
    }

    return false;
  };

  if (!hasAccess()) {
    if (admin?.role === 'Admin') return <Navigate to="/" replace />;

    if (admin?.role === 'Moderator' && admin?.access) {
      const allowedPages = Object.keys(admin.access);
      if (allowedPages.length > 0) {
        const firstPageSlug = getSlugFromPageKey(allowedPages[0]);
        return <Navigate to={`/${firstPageSlug}`} replace />;
      }
    }

    return <Navigate to="/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminProtectedRoute;