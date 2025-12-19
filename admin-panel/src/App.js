import { Route, Routes } from 'react-router-dom';

import ScrollToTop from "./utils/ScrollToTop"

import AdminProtectedRoute from './utils/AdminProtectedRoute.js';
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from './pages/AdminDashboard.js';
import Employees from './pages/Employees.js';
import AdminTerms from './pages/AdminTerms.js';
import SocialLinks from './pages/AdminSocialLinks.js';
import AdminSellers from './pages/AdminSellers.js';
import AdminUsers from './pages/AdminUsers.js';
import NotFound from './utils/NotFound.js';
import AdminFAQ from './pages/AdminFAQ.js';
import AdminEmails from './pages/AdminEmails.js';
import AdminServices from './pages/AdminServices.js';
import AdminProducts from './pages/AdminProducts.js';

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
                    <Route path="/terms" element={<AdminTerms />} />
                    <Route path="/social" element={<SocialLinks />} />
                    <Route path="/sellers" element={<AdminSellers />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path='/faq' element={<AdminFAQ />} />
                    <Route path='/emails' element={<AdminEmails />} />
                    <Route path='/products' element={<AdminProducts />} />
                    <Route path='/services' element={<AdminServices />} />
                </Route>

            </Routes>
        </>
    );
}

export default App;
