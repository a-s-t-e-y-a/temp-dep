import React from 'react';
import { assets } from '../../assets/assets';

const OrderCancelled = ({ order }) => {
  const { createdAt = '' } = order || {};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex items-start space-x-3">
      {/* Left column: vertical progress */}
      <div className="flex flex-col items-center">
        <img src={assets.accept} loading="lazy" className="h-8 max-w-full mt-1" />

        {/* Dashed line */}
        <div className="h-10 border-l-2 my-1 border-dotted border-gray-300"></div>

        {/* Gray outlined circle */}
        <div className="w-8 h-8 rounded-full border-2 border-gray-300"></div>
      </div>

      {/* Right column: Text content */}
      <div className="flex flex-col space-y-0">
        {/* Step 1 */}
        <div>
          <p className="font-[500] text-black mb-0 pb-0 text-[14px]">Order Confirmed</p>
          <p className="font-[500] text-[#939393] text-[12px]">
            Your order has been placed on {formatDate(createdAt)}
          </p>
        </div>

        {/* Step 2 - Cancelled */}
        <div>
          <p className="text-[14px] font-[500] text-[#FF5400] mt-8 mb-0">Cancelled</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelled;
