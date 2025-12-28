import React from 'react';
import { assets } from '../../assets/assets';

const OrderDelivered = ({ order }) => {
  const { createdAt = '' } = order || {};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  return (
    <div className="flex items-start space-x-3">
      {/* Left column: vertical progress */}
      <div className="flex flex-col items-center">
        
         <img src={assets.accept} loading="lazy" className='h-8 max-w-full mt-1'/>
        

        
        <div className="h-10 border-l-2 border-[1px] border-[#4BAE4F] mt-1"></div>

        {/* Gray outlined circle */}
        <img src={assets.accept} className='h-8 max-w-full mt-1'/>
    
      </div>

      {/* Right column: Text content */}
      <div className="flex flex-col space-y-0">
        {/* Step 1 */}
        <div>
          <p className="font-[500] text-black mb-0 pb-0 text-[14px]">Order Confirmed</p>
          <p className="font-[500] text-[#939393] text-[12px] ">Your order has been placed on {formatDate(createdAt)}</p>
        </div>

        {/* Step 2 - Cancelled */}
        <div>
          <p className="text-[14px] font-[500] text-black mt-4 mb-0">Delivered</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDelivered;
