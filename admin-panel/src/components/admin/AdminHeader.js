import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MdAnalytics } from "react-icons/md";
import { FaShop, FaNetworkWired, FaEnvelope, FaUsers, FaBoxesStacked } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { BsFileEarmarkRuledFill, BsInfoSquareFill } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { GrServices } from "react-icons/gr";
import { AuthContext } from '../../utils/AuthContext';

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
    { path: 'products', icon: <FaBoxesStacked className='icon' />, label: 'Products' },
    { path: 'services', icon: <GrServices className='icon' />, label: 'Services' },
    { path: 'social', icon: <FaNetworkWired className='icon' />, label: 'Social Links' },
    { path: 'terms', icon: <BsFileEarmarkRuledFill className='icon' />, label: 'Terms & Conditions' },
    { path: 'faq', icon: <BsInfoSquareFill className='icon' />, label: 'Information Center' },
    { path: 'emails', icon: <FaEnvelope className='icon' />, label: 'Email Campaigns' },
    { path: 'employees', icon: <FaUsers className='icon' />, label: 'Employees' },
  ];

  return (
    <div className='adminHeaderDiv'>
      <section className="section">
        <div className="adminHeaderContent">

          <div className="faithzyLogoDiv">
            <img src="/assets/images/Logo.png" alt="Faithzy Logo" className='faithzyLogo' />
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