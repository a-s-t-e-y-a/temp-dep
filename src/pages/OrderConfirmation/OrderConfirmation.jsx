import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkedimg from "../../assets/checkedimg.png";
import { useAddresses } from "../../context/AddressContext";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown

  const orderId = location?.state?.orderId;
  const { selectedAddress } = useAddresses();

  useEffect(() => {
    // Mark that payment is confirmed
    localStorage.setItem("paymentConfirmed", "true");

    const handlePopState = () => {
      const paymentConfirmed = localStorage.getItem("paymentConfirmed");
      if (paymentConfirmed === "true") {
        localStorage.removeItem("paymentConfirmed");
        window.location.reload();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === 0) {
      // Clear any pending navigation state
      localStorage.removeItem("paymentConfirmed");

      // Full page reload to clear all React state, then redirect to home
      window.location.href = "/";
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-5 relative w-[120px] h-[120px] flex items-center justify-center">
          <span className="absolute w-[120px] h-[120px] rounded-full bg-[#E8F9F1]"></span>
          <span className="absolute w-[100px] h-[100px] rounded-full bg-[#D4F4E5]"></span>
          <span className="absolute w-[80px] h-[80px] rounded-full bg-[#C2EFDA] flex items-center justify-center">
            <img
              src={checkedimg}
              alt="Order confirmed"
              loading="lazy"
              className="w-[60px] h-[60px] md:w-[75px] md:h-[75px]"
            />
          </span>
        </div>

        <h2 className="text-base sm:text-2xl md:text-2xl font-bold text-black mb-2">
          Order Confirmed
        </h2>

        <div className="text-sm md:text-[16px] text-black text-center leading-tight mb-2">
          Delivering to{" "}
          {selectedAddress && selectedAddress.buildingName
            ? [
                selectedAddress.buildingName,
                selectedAddress.street,
                selectedAddress.city,
                selectedAddress.pincode,
              ]
                .filter(Boolean)
                .join(", ")
            : ""}
        </div>

        <div className="text-sm md:text-[18px] text-[#939393] mt-4 mb-2">
          Order id: {orderId}
        </div>

        {/* Countdown Timer */}
        <div className="mt-6 text-center">
          <p className="text-sm md:text-base text-gray-600">
            Redirecting to home page in{" "}
            <span className="font-bold text-green-600 text-lg">
              {countdown}
            </span>{" "}
            seconds...
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
