import React from "react";
import crossSign from "../../assets/crosssign.png";

const PaymentFailed = ({ onRetry }) => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        {/* Red Cross Icon from assets */}
        <div className="mb-4">
          <img
            src={crossSign}
            alt="Payment Failed"
            className="w-24 h-24 object-contain"
          />
        </div>
        {/* Text */}
      <div className="text-[28px]sm:text-[18px] md:text-[20px] lg:text-[19px]  text-black font-bold text-center mb-3 leading-snug">
          <div>Sorry, your payment request is</div>
          <div className="mt-1">failed.</div>
        </div>

        {/* Try Again Button */}
        <button
          onClick={onRetry}
          className="px-24 py-3 border-2 border-[#0C5273] rounded bg-white text-[#0C5273] text-[15px] font-semibold lg:hover:bg-[#0C5273]  transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
