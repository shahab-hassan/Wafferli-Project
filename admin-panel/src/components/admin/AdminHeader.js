import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MdAnalytics, MdLocalOffer, MdPlace } from "react-icons/md";
import { FaShop, FaEnvelope, FaUsers, FaBoxesStacked, FaBlog } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { BsFileEarmarkRuledFill, BsInfoSquareFill } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { GrServices } from "react-icons/gr";
import { AuthContext } from '../../utils/AuthContext';
import { MdEmojiEvents } from "react-icons/md";

function AdminHeader() {
  const { admin, adminLogout } = useContext(AuthContext);

  const hasAccess = (page) => {
    if (admin?.role === 'Super Admin') return true;
    if (admin?.role === 'Admin') return page !== 'Employees';
    if (admin?.role === 'Moderator') return admin?.access[page] !== undefined;
    return false;
  };

  const pages = [
    { path: '', icon: <MdAnalytics className='icon' />, label: 'Dashboard' },
    { path: 'users', icon: <FaUserCircle className='icon' />, label: 'Users' },
    { path: 'sellers', icon: <FaShop className='icon' />, label: 'Sellers' },
    { path: 'product-ads', icon: <FaBoxesStacked className='icon' />, label: 'Product Ads' },
    { path: 'service-ads', icon: <GrServices className='icon' />, label: 'Service Ads' },
    { path: 'explore-ads', icon: <MdPlace className='icon' />, label: 'Explore Ads' },
    { path: 'offer-ads', icon: <MdLocalOffer className='icon' />, label: 'Offer Ads' },
    { path: 'event-ads', icon: <MdEmojiEvents className='icon' />, label: 'Event Ads' },
    { path: 'blogs', icon: <FaBlog className='icon' />, label: 'Blogs' },
    { path: 'terms-policy', icon: <BsFileEarmarkRuledFill className='icon' />, label: 'Terms & Policy' },
    { path: 'faq', icon: <BsInfoSquareFill className='icon' />, label: 'FAQ' },
    { path: 'emails', icon: <FaEnvelope className='icon' />, label: 'Email Campaigns' },
    { path: 'employees', icon: <FaUsers className='icon' />, label: 'Employees' },
  ];

  return (
    <div className='adminHeaderDiv'>
      <section className="section">
        <div className="adminHeaderContent">

          <div className="wafferliLogoDiv">
            <img src="/assets/images/Logo.png" alt="Wafferli Logo" className='wafferliLogo' />
          </div>

          <div className="horizontalLine"></div>

          <ul className="mainMenu">
            {pages.map((page, index) => (
              hasAccess(page.label) && (
                <li key={index}>
                  <NavLink to={`/${page.path}`} className={(v) => `${v.isActive ? "activeLi" : ""}`}>
                    {page.icon}
                    {page.label}
                  </NavLink>
                </li>
              )
            ))}
            <li>
              <NavLink className="adminLogoutBtn" onClick={adminLogout}><HiOutlineLogout /> Logout</NavLink>
            </li>
          </ul>

        </div>
      </section>
    </div>
  );
}

export default AdminHeader;