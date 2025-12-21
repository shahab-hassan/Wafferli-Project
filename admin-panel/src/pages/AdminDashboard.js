import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FaUsers, FaListUl, FaHeart, FaStar, FaNewspaper, FaEnvelopeOpenText } from 'react-icons/fa';
import Loader from '../utils/Loader';

function AdminDashboard() {
  const [generalInfo, setGeneralInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/dashboard/general`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setGeneralInfo(response.data.generalInfo);
      }
    } catch (e) {
      enqueueSnackbar(e.response?.data?.error || 'Failed to fetch data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='adminDashboardDiv'><Loader type="simple" /></div>;

  return (
    <div className='adminDashboardDiv'>
      <div className="adminDashboardContent">
        <h1 className="mainHeading">Platform Insights</h1>

        <div className="dashboardOverview">
          {/* Users Section */}
          <div className="overviewBox">
            <div className="boxHeader">
              <FaUsers className="icon blue" />
              <h2 className="secondaryHeading">Community</h2>
            </div>
            <div className='value'>{generalInfo.totalUsers || 0}</div>
            <div className="subtitle">Total Registered Users</div>
            <div className="horizontalLine"></div>
            <div className="row"><span>Verified</span><strong>{generalInfo.verifiedUsers}</strong></div>
            <div className="row"><span>Unverified</span><strong>{generalInfo.unverifiedUsers}</strong></div>
          </div>

          {/* Listings Overview */}
          <div className="overviewBox">
            <div className="boxHeader">
              <FaListUl className="icon purple" />
              <h2 className="secondaryHeading">Listings</h2>
            </div>
            <div className='value'>{generalInfo.totalListings || 0}</div>
            <div className="subtitle">Active Posts Across Platform</div>
            <div className="horizontalLine"></div>
            <div className="grid-mini">
              <div>Products: {generalInfo.productListings}</div>
              <div>Services: {generalInfo.serviceListings}</div>
              <div>Events: {generalInfo.eventListings}</div>
              <div>Offers: {generalInfo.offerListings}</div>
            </div>
          </div>

          {/* New: Growth Section */}
          <div className="overviewBox">
            <div className="boxHeader">
              <FaEnvelopeOpenText className="icon green" />
              <h2 className="secondaryHeading">Newsletter</h2>
            </div>
            <div className='value'>{generalInfo.totalSubscribers || 0}</div>
            <div className="subtitle">Active Email Subscribers</div>
            <div className="horizontalLine"></div>
            <div className="row">
              <FaNewspaper className="mr-2" />
              <span>Blog Posts: <strong>{generalInfo.totalBlogPosts}</strong></span>
            </div>
          </div>
        </div>

        {/* Engagement Grid */}
        <div className="quickStatsGrid">
          <div className="statCard">
            <h3><FaHeart className='icon red' /> Interaction Metrics</h3>
            <div className="statRows">
              <div className="statRow">
                <span>Total Favorites</span>
                <strong>{generalInfo.totalFavorites}</strong>
              </div>
              <div className="statRow">
                <span>Total Reviews</span>
                <strong>{generalInfo.totalReviews}</strong>
              </div>
              <div className="statRow">
                <span>Avg Reviews per Listing</span>
                <strong>
                  {generalInfo.totalListings > 0
                    ? (generalInfo.totalReviews / generalInfo.totalListings).toFixed(1)
                    : 0}
                </strong>
              </div>
            </div>
          </div>

          <div className="statCard">
            <h3><FaStar className='icon yellow' /> Platform Health</h3>
            <div className="statRows">
              <div className="statRow">
                <span>Verification Rate</span>
                <strong>
                  {((generalInfo.verifiedUsers / generalInfo.totalUsers) * 100).toFixed(1)}%
                </strong>
              </div>
              <div className="statRow">
                <span>Content Density</span>
                <strong>
                  {(generalInfo.totalListings / generalInfo.totalUsers).toFixed(1)} posts/user
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;