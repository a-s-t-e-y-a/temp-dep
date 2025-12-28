import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE =  import.meta.env.VITE_API_URL;

const PaymentTimer = ({ minutes = 10 }) => {
  const { idToken } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [paymentStatus, setPaymentStatus] = useState('⌛ Waiting for payment...');
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
 
  if (!orderId) {
    console.error('Order ID is missing. Cannot poll payment status.');
    return;
  }

    let retryCount = 0;
    const maxRetries = 20;

    const interval = setInterval(async () => {
      if (retryCount >= maxRetries) {
        clearInterval(interval);
        setPaymentStatus('⚠️ Payment timed out. Please try again.');
        return;
      }

      retryCount++;
      try {
        const res = await fetch(`${API_BASE}/api/zaakpay/status?orderId=${orderId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const statusData = await res.json();
        // console.log('--- Poll Attempt #' + retryCount + ' ---');
        // console.log('Full polling response:', statusData);

        const status = statusData.status || statusData.txnStatus;

        if (status === 'SUCCESS' || status === '0') {
          clearInterval(interval);
          setPaymentStatus('✅ Payment Successful!');
          navigate('/order-confirmation', { state: { orderId } });
        } else if (status === 'FAILED') {
          clearInterval(interval);
          setPaymentStatus('❌ Payment Failed!');
          navigate('/payment/failed');
        } else {
          setPaymentStatus('⌛ Waiting for payment...');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutesDisplay = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secondsDisplay = String(secondsLeft % 60).padStart(2, '0');

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = ((minutes * 60 - secondsLeft) / (minutes * 60)) * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white text-center px-4 ml-0 mr-0">
      <div className="mt-20 space-y-8">
        <p className="text-[#939393] text-md text-base font-medium">
          Open your UPI app to approve the <br />payment request.
        </p>

        {/* Enlarged Circular Timer */}
        <div className="relative w-[160px] h-[160px] mx-auto">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#E5E5E5"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#FECC0B"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center font-semibold text-black">
            <span className="text-2xl">{minutesDisplay}:{secondsDisplay}</span>
            <span className="text-sm font-normal text-gray-500">mins</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <p className="text-black text-md font-semibold text-base text-center">
            Please approve the payment request before<br />it times out.
          </p>
          <p className="text-[#939393] text-[12px] text-center font-medium">
            Do not hit back button until the transaction is complete.
          </p>
          <p className="text-gray-600 text-sm mt-2">{paymentStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentTimer;
