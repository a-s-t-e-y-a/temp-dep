// src/analytics/ScreenTracker.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase.config';
import { logEvent } from 'firebase/analytics';

const screenNameFromPath = (pathname) => {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/food/')) return 'ProductDetails';
  if (pathname.startsWith('/category/')) return 'Category';
  if (pathname.startsWith('/search')) return 'Search';
  if (pathname.startsWith('/range/')) return 'Range';
  if (pathname.startsWith('/combo')) return 'Combo';
  if (pathname.startsWith('/account')) return 'Account';
  return pathname.replace(/\W+/g, '_') || 'Unknown';
};

export default function ScreenTracker() {
  const location = useLocation();

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

  return null;
}
