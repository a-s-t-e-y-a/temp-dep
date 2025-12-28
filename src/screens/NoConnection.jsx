import React from 'react';
import { assets } from '../assets/assets';

const NoConnection = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-white px-4">
      <img
        src={assets.noConnection}
        alt="No Internet Connection"
        className="max-w-full h-[220px] mb-2"
      />
      <h2 className="text-[22px] font-[600] text-[#FFD54F] mb-3">
        No Connection
      </h2>
      <p className="text-[18px] text-black mb-6 text-wrap max-w-[400px]">
        No internet connection found. Check your connection or try again.
      </p>
      <button
        onClick={handleRetry}
        className="bg-[#0C5273] text-white text-[18px] font-[600] px-5 py-2 rounded-lg hover:bg-[#01344d] w-[300px] transition"
      >
        Try again
      </button>
    </div>
  );
};

export default NoConnection;
