import { Route, Routes } from 'react-router-dom';

import ScrollToTop from "./utils/ScrollToTop"

import AdminProtectedRoute from './utils/AdminProtectedRoute.js';
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from './pages/AdminDashboard.js';
import Employees from './pages/Employees.js';
import AdminSellers from './pages/AdminSellers.js';
import AdminUsers from './pages/AdminUsers.js';
import NotFound from './utils/NotFound.js';
import AdminFAQ from './pages/AdminFAQ.js';
import AdminEmails from './pages/AdminEmails.js';
import AdminEventAds from './pages/AdminEvents.js';
import AdminProductAds from './pages/AdminProducts.js';
import AdminServiceAds from './pages/AdminServices.js';
import AdminExploreAds from './pages/AdminExplore.js';
import AdminOfferAds from './pages/AdminOffers.js';
import AdminTermsPolicy from './pages/AdminTermsPolicy.js';
import AdminBlogs from './pages/AdminBlogs.js';

function App() {

    return (
        <>
            <ScrollToTop />

            <Routes>

                <Route>
                    <Route path='/login' element={<AdminLogin />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route element={<AdminProtectedRoute />}>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/terms-policy" element={<AdminTermsPolicy />} />
                    <Route path="/sellers" element={<AdminSellers />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path='/faq' element={<AdminFAQ />} />
                    <Route path='/emails' element={<AdminEmails />} />
                    <Route path='/product-ads' element={<AdminProductAds />} />
                    <Route path='/service-ads' element={<AdminServiceAds />} />
                    <Route path='/explore-ads' element={<AdminExploreAds />} />
                    <Route path='/offer-ads' element={<AdminOfferAds />} />
                    <Route path='/event-ads' element={<AdminEventAds />} />
                    <Route path='/blogs' element={<AdminBlogs />} />
                </Route>

            </Routes>
        </>
    );
}

export default App;
