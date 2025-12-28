// src/AppLayout.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, ScrollRestoration, useNavigation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { StoreContext } from './context/StoreContext';
import { CartContext } from './context/CartContext';
import Header from './components/Header/Header';
import Menubar from './components/Menubar/Menubar';
import Footer from './components/Footer/Footer';
import Cart2Drawer from './components/Cart2Drawer/Cart2Drawer';
import AddToCartDrawer from './components/AddToCartDrawer/AddToCartDrawer';
import NoConnection from './screens/NoConnection.jsx';

// Analytics
import { analytics } from './firebase.config';
import { logEvent } from 'firebase/analytics';

// Map paths to readable screen names
const screenNameFromPath = (pathname) => {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/food/')) return 'ProductDetails';
  if (pathname.startsWith('/category/')) return 'Category';
  if (pathname.startsWith('/search')) return 'Search';
  if (pathname.startsWith('/range/')) return 'Range';
  if (pathname.startsWith('/combo')) return 'Combo';
  if (pathname.startsWith('/account')) return 'Account';
  if (pathname.startsWith('/order')) return 'Order';
  if (pathname.startsWith('/payment')) return 'Payment';
  if (pathname.startsWith('/about')) return 'About';
  return pathname.replace(/\W+/g, '_') || 'Unknown';
};

const AppLayout = () => {
  // Contexts
  const { token } = useContext(StoreContext);
  const { showCart, setShowCart } = useContext(CartContext);

  // Router state
  const location = useLocation();
  const navigation = useNavigation();
  const isPending = Boolean(navigation.location); // true while the next route is loading

  // Device/connection state
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth < 640);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  // Auth flags (kept for your UI logic)
  const isOrderPage = location.pathname === '/order';
  const isGuest = useMemo(() => localStorage.getItem('guest') === 'true', []);
  const isAuthenticated = token || isGuest;

  // Hide chrome on payment pages (small screens)
  const hideHeaderAndMenu =
    (location.pathname === '/payment' || location.pathname === '/payment/timer') && isSmallScreen;

  // Window and network listeners
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Centralized screen_view tracking on every navigation
  useEffect(() => {
    if (!analytics) return;
    const screenName = screenNameFromPath(location.pathname);
    logEvent(analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenName,
      page_location: window.location.href,
      page_referrer: document.referrer || undefined,
    });
  }, [location]);

  if (!isOnline) return <NoConnection />;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <ScrollRestoration />

        {/* Header */}
        {!hideHeaderAndMenu && !isOrderPage && (
          <div className="lg:sticky md:sticky top-0 z-50 bg-white shadow-md">
            <Header />
          </div>
        )}

        {/* Menubar */}
        {!hideHeaderAndMenu && !isOrderPage && (
          <div className="sticky lg:top-[45px] md:top-[45px] top-[0px] z-40 bg-white">
            <Menubar />
          </div>
        )}

        {/* Toasts */}
        {!hideHeaderAndMenu && <ToastContainer />}

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Drawers */}
        {!hideHeaderAndMenu && showCart && <Cart2Drawer onClose={() => setShowCart(false)} />}
        {!hideHeaderAndMenu && <AddToCartDrawer />}

        {/* Footer */}
        {!hideHeaderAndMenu && !isOrderPage && <Footer />}

        {/* Global pending overlay */}
        {isPending && (
          <div className="fixed inset-0 z-[9999] bg-black/15 backdrop-brightness-60 transition-opacity" />
        )}
      </div>
    </>
  );
};

export default AppLayout;
