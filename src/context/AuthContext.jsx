// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { analytics } from '../firebase.config';
import { logEvent } from 'firebase/analytics';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onIdTokenChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    // Periodically refresh token every 10 minutes
    let intervalId;
    function startTokenRefreshInterval() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(async () => {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken(true); // force refresh
          setIdToken(token);
        }
      }, 10 * 60 * 1000); // 10 minutes
    }

    // Refresh token when tab becomes visible
    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && auth.currentUser) {
        auth.currentUser.getIdToken(true).then(setIdToken);
      }
    }

    if (auth.currentUser) {
      startTokenRefreshInterval();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unsub();
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const getFreshIdToken = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      setIdToken(token);
      return token;
    }
    return null;
  };

  const secureFetch = async (url, options = {}) => {
    const token = await getFreshIdToken();
    if (!token) throw new Error("No authenticated user");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setIdToken(null);
    logEvent(analytics, 'log_out', { platform: 'web' });
    localStorage.removeItem("token");
    localStorage.removeItem("userLocation");
    localStorage.removeItem("savedAddressId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userId");
    localStorage.removeItem("guest");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      delete window.recaptchaVerifier;
    }
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, idToken, getFreshIdToken, secureFetch, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
