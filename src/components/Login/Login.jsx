import React, { useContext, useState, useEffect, useRef } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import OtpInput from 'otp-input-react';
import { auth } from '../../firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { backendLogin } from '../../service/loginService';
import { X } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { logEvent, setUserId} from 'firebase/analytics';
import { analytics } from '../../firebase.config';

const BusyOverlay = () => (
  <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-20 rounded-2xl">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0C5273] rounded-full animate-spin" />
  </div>
);

const Login = ({ onCancel }) => {
  const { loading, error, clearError } = useContext(StoreContext);
  const { loadCartData } = useContext(CartContext);
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (window.recaptchaVerifier && window.recaptchaOwner === 'login') {
      try { window.recaptchaVerifier.clear(); } catch {}
      delete window.recaptchaVerifier;
      delete window.recaptchaOwner;
    }
    if (error && clearError) clearError();


    const initializeRecaptcha = async () => {
      try {
        const hostId = 'recaptcha-container';
        const host = document.getElementById(hostId);
        if (!host) return; 

        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch {}
          delete window.recaptchaVerifier;
          delete window.recaptchaOwner;
        }

    
        window.recaptchaVerifier = new RecaptchaVerifier(auth, hostId, { size: 'invisible' });
        window.recaptchaOwner = 'login';


        await window.recaptchaVerifier.render();
        console.log('reCAPTCHA pre-rendered successfully');
      } catch (err) {
        console.error('Failed to pre-render reCAPTCHA:', err);
      }
    };

  
    const timer = setTimeout(initializeRecaptcha, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (window.recaptchaVerifier && window.recaptchaOwner === 'login') {
        try { window.recaptchaVerifier.clear(); } catch {}
        delete window.recaptchaVerifier;
        delete window.recaptchaOwner;
      }
    };
  }, [error, clearError]);

  const setSafe = (setter) => (...args) => mountedRef.current && setter(...args);
  const setBusySafe = (v) => mountedRef.current && setIsBusy(v);
  const showBusy = isBusy || loading;

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digits);
    if (validationError) setValidationError('');
  };

  const ensureRecaptcha = () => {
    if (window.recaptchaVerifier && window.recaptchaOwner === 'login') {
      return window.recaptchaVerifier;
    }
    // Fallback: create new if not pre-rendered
    const hostId = 'recaptcha-container';
    const host = document.getElementById(hostId);
    if (!host) throw new Error('reCAPTCHA container missing');
    window.recaptchaVerifier = new RecaptchaVerifier(auth, hostId, { size: 'invisible' });
    window.recaptchaOwner = 'login';
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return setValidationError('Enter a valid 10-digit number');
    }
    try {
      setBusySafe(true);
      const appVerifier = ensureRecaptcha(); // invisible
      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
      console.log('OTP sent successfully', confirmation);
      setSafe(setConfirmationResult)(confirmation);
      setSafe(setOtpSent)(true);
      toast.success('OTP sent successfully');
    } catch (err) {
      console.error(err);
      toast.error('Retry login');
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch {}
        delete window.recaptchaVerifier;
        delete window.recaptchaOwner;
      }
      if (typeof onCancel === 'function') onCancel();
    } finally {
      setBusySafe(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setValidationError('Enter the 6-digit OTP');
    if (!confirmationResult) {
      toast.error('Session expired. Please request a new OTP.');
      setOtp('');
      setOtpSent(false);
      return;
    }
    try {
      setBusySafe(true);
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);
      // console.log('ID Token:', idToken);
      localStorage.removeItem('guest');
      const data = await backendLogin(idToken);
      const user = result.user;
      const phone = user.phoneNumber || '';
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userId', data.uid ?? '');
      setUserId(analytics, data.uid)
      logEvent(analytics, 'login', { method: 'phone', platform: 'web' });
      toast.success('Login Successful!');
      navigate('/');
    } catch (err) {
      console.error('OTP verification or login error:', err);
      toast.error('Invalid OTP or login failed');
    } finally {
      setBusySafe(false);
    }
  };

  const handleSkipLogin = () => {
    localStorage.setItem('guest', 'true');
    if (onCancel) onCancel();
    else navigate('/', { replace: true });
  };

  return (
    <>
      <div id="recaptcha-container" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        {/* Sheet */}
        <div className="relative w-[92%] sm:w-[380px] md:w-[420px] rounded-[20px] bg-white px-6 pt-9 pb-3 shadow-xl">
          {showBusy && <BusyOverlay />}

          {/* Close */}
          <button
            onClick={handleSkipLogin}
            disabled={showBusy}
            aria-label="Close"
            className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="text-black" />
          </button>

          {/* Logo inside the component */}
          <div className="grid place-items-center mb-1">
            <img src={logo} alt="Logo" loading="lazy" className="w-20 h-20 object-contain block" />
          </div>


          {/* Title + helper */}
          {!otpSent && (
            <>
              <h2 className="text-[32px] leading-none font-bold text-black mb-2">Sign in</h2>
              <p className="text-[15px] text-gray-700 mb-6">
                Enter your phone number to continue
              </p>

              <form onSubmit={handleSendOtp}>
                {/* Phone row: +91 | divider | input */}
                <div className="mx-auto w-full">
                  <div className="flex items-stretch max-w-[360px]">
                    <span className="rounded-l-[12px] border border-r-0 border-[#BBBABA] px-3 py-3 text-[14px] font-semibold text-black bg-white">
                      +91
                    </span>
                    <span className="w-px bg-[#BBBABA]" />
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="flex-1 rounded-r-[12px] border border-l-0 border-[#BBBABA] px-3 py-3 text-[16px] outline-none placeholder:text-gray-400"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={handleChange}
                      disabled={showBusy}
                      required
                      aria-invalid={!!validationError}
                    />
                  </div>
                </div>

                {validationError && (
                  <div className="text-[#0C5273] mt-2 text-sm">{validationError}</div>
                )}

                <button
                  type="submit"
                  disabled={showBusy || !phoneNumber}
                  className="mt-6 w-full py-3.5 rounded-[12px] bg-[#0C5273] text-white font-semibold hover:bg-[#00384C] transition disabled:opacity-60"
                >
                  {showBusy ? 'Processing…' : 'Continue'}
                </button>
              </form>
            </>
          )}

          {/* OTP step */}
          {otpSent && (
            <>
              <h2 className="text-[28px] leading-none font-bold text-black mb-1 mt-4">Enter OTP Code</h2>
              <p className="text-[15px] text-gray-700 mb-2">We’ve sent an OTP on your device</p>

              <form onSubmit={handleVerifyOtp}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={showBusy}
                autoFocus
                className="opt-container"
              />
                {validationError && (
                  <div className="text-[#0C5273] mt-1 text-sm">{validationError}</div>
                )}
                <button
                  type="submit"
                  disabled={showBusy || otp.length !== 6}
                  className="mt-1 w-full py-3.5 rounded-[12px] bg-[#0C5273] text-white font-semibold hover:bg-[#00384C] transition disabled:opacity-60"
                >
                  {showBusy ? 'Verifying…' : 'Verify Code'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;

