
import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { LuCalendarDays } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useAuth } from '../../context/AuthContext';
import MyOrders from './Myorders.jsx';
import Profile from './Profile.jsx';
import { fetchOrders } from '../../service/orderService';
import { getprofile, updateProfile } from '../../service/profileService';
import Logout from '../Logout/Logout.jsx';


const Account = () => {
  const [notification, setNotification] = useState('Allow');
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => (window.innerWidth >= 768 ? 'profile' : 'none'));

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const dateInputRef = useRef(null);

  const { idToken } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');   // keep empty so placeholder shows
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);


  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.click();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load profile
  useEffect(() => {
    (async () => {
      try {
        // if (!idToken) {
        //   toast.info('Please log in to view your profile.');
        //   return;
        // }
        const data = await getprofile(idToken);
        setName(data?.name || '');
        setEmail(data?.email || '');
        setDob(data?.dob || '');
      } catch (error) {
      }
    })();
  }, [idToken]);

  // Load orders on tab open
  useEffect(() => {
    if (activeTab !== 'orders') return;
    (async () => {
      try {
        if (!idToken) throw new Error('Login to view orders');
        const data = await fetchOrders(idToken);
        setOrders(Array.isArray(data) ? data : data?.orders || []);
      } catch (error) {
        console.error('Orders load error:');
        toast.error(`Something went wrong`);
        setOrders([]);
      }
    })();
  }, [activeTab, idToken]);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      if (!idToken) throw new Error('Not authenticated');

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) throw new Error('Please enter a valid email address.');

  await updateProfile({ name, email, dob, idToken });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:max-h-screen px-4 py-0 sm:px-6 md:px-8 mb-4 text-black">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-black lg:pl-6 md:pl-0 text-left lg:mx-[70px] md:mx-[0px] mt-4 mb-4">
        My Account
      </h1>

      <div className="w-full flex flex-row lg:gap-24 justify-center items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <div className="lg:w-full md:w-[260px] bg-white border-2 border-[#D9D9D9] rounded-[15px] p-6">
            <div className="flex items-center gap-4 mb-2">
              <img src={assets.profile} alt="Profile" loading="lazy" className="max-w-full lg:h-16 h-8 rounded-full" />
              <div>
                <div className="text-[14px] lg:text-[17px] font-semibold">{name || 'Your name'}</div>
                <div className="text-[14px] lg:text-[17px] text-black">{email || 'yourname@gmail.com'}</div>
              </div>
            </div>

            <hr className="mb-3" />
            <div className="space-y-4">
              <button
                className="w-full flex justify-between items-center text-left text-sm relative transition-transform duration-300 ease-in-out lg:hover:-translate-y-1"
                onClick={() => setActiveTab('profile')}
              >
                <span className="flex items-center gap-2">
                  <img src={assets.user} alt="user" loading="lazy" className="w-5 h-5" />
                  My Profile
                </span>
                <GoChevronRight />
              </button>

              <div
                className="flex justify-between items-center text-sm relative transition-transform duration-300 ease-in-out lg:hover:-translate-y-1 z-30"
                ref={notifRef}
              >
                <span className="flex items-center gap-2">
                  <img src={assets.notification} alt="notification" loading="lazy" className="w-5 h-5" />
                  Notifications
                </span>
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="flex items-center justify-between gap-1 text-[#7B7B7B] py-1.5 pl-12 min-w-[80px] bg-white rounded cursor-pointer text-sm"
                  >
                    <span>{notification}</span>
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-1 min-w-[80px] bg-white z-20 rounded-[15px] shadow text-center py-1">
                      <div
                        onClick={() => {
                          setNotification('Allow');
                          setNotifOpen(false);
                        }}
                        className={`cursor-pointer py-1 text-sm lg:hover:bg-gray-100 ${
                          notification === 'Allow' ? 'font-semibold' : ''
                        }`}
                      >
                        Allow
                      </div>
                      <hr className="border-2 border-[#D9D9D9] my-1 mx-2.5" />
                      <div
                        onClick={() => {
                          setNotification('Mute');
                          setNotifOpen(false);
                        }}
                        className={`cursor-pointer py-1 text-sm lg:hover:bg-gray-100 ${
                          notification === 'Mute' ? 'font-semibold' : ''
                        }`}
                      >
                        Mute
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="w-full flex justify-between items-center text-left text-sm relative transition-transform duration-300 ease-in-out lg:hover:-translate-y-1"
                onClick={() => setActiveTab('orders')}
              >
                <span className="flex items-center gap-2">
                  <img src={assets.booking} alt="orders" className="w-5 h-5" />
                  My Orders
                </span>
                <GoChevronRight />
              </button>

              <button
                className="w-full flex justify-between items-center text-left text-sm relative transition-transform duration-300 ease-in-out lg:hover:-translate-y-1"
                onClick={() => setShowLogoutModal(true)}
              >
                <span className="flex items-center gap-2">
                  <img src={assets.logout2} alt="logout" className="w-5 h-5" />
                  Log Out
                </span>
                <GoChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'profile' ? (
          <Profile
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            dob={dob}
            setDob={setDob}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            handleSaveChanges={handleSaveChanges}
            dateInputRef={dateInputRef}
            handleCalendarClick={handleCalendarClick}
          />
        ) : activeTab === 'orders' ? (
          <MyOrders orders={orders} onBack={() => setActiveTab('none')} />
        ) : null}
      </div>

      {showLogoutModal && (
        <Logout onCancel={() => setShowLogoutModal(false)} />
      )}
    </div>
  );
};

// ...existing code...
export default Account;
