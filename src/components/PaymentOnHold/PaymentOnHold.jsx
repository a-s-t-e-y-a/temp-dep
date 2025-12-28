import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE =  import.meta.env.VITE_API_URL;

function PaymentOnHold() {
   const location = useLocation();
   const navigate = useNavigate();
   const orderId = location.state?.orderId;

  const { idToken } = useAuth();

  useEffect(() => {
      console.log("📦 PaymentTimer mounted");
    console.log("🧾 orderId received:", orderId);
  
    if (!orderId) {
      console.warn("❌ No orderId received. Polling aborted.");
      return;
    }
  
      let retryCount = 0;
      const maxRetries = 40;
  
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
          console.log('--- Poll Attempt #' + retryCount + ' ---');
          console.log('Full polling response:', statusData);
  
          const status = statusData.status || statusData.txnStatus;
  
          if (status === 'SUCCESS' || status === '0') {
            clearInterval(interval);
            setPaymentStatus('✅ Payment Successful!');
            navigate('/order-confirmation');
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
      }, 4000);
  
      return () => clearInterval(interval);
    }, [orderId, navigate]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]">
      {/* Circular spinning loader */}
      <div
        className="w-28 h-28 border-8 border-[#D8D8D894] border-t-[#FECC0B] rounded-full animate-spin mt-4"
        style={{ animationDuration: "2.5s" }}
      ></div>

      {/* Text below spinner */}
      <p className="text-center text-[20px] text-black font-semibold mt-6">Hold On!</p>
      <p className="text-center text-[16px] font-semibold mt-0 text-[#939393]">
        We are verifying your payment status
      </p>

      <p className="text-center text-[16px] font-[600] mt-16 sm:mt-16 mt-28 px-4 max-w-[400px]">
        <span className="text-black">Note:</span>
        <span className="text-[#939393]">
          {" "}
          Do not hit back button or close this screen until the transaction is complete
        </span>
      </p>
    </div>
  );
}

export default PaymentOnHold;
