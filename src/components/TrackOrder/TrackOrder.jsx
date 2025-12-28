import React from 'react';
import { X } from 'lucide-react'; // ✅ Make sure this matches your icon library
import OrderTransit from '../OrderStatus/OrderTransit';

function TrackOrder({ onClose, currentStatus,shipmentStatusNo, order }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{ background: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white w-[80%] w-[370px]  lg:rounded-[16px] md:rounded-[16px] rounded-[5px] lg:w-[450px] md:w-[380px] max-h-full p-3 text-left">
        <div className="flex justify-between items-center mb-0">
          <span></span>
          <h2 className="text-xl font-semibold text-black mb-1">Tracking Details</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700 hover:text-black" />
          </button>
        </div>
        <div className='lg:p-4 md:p-4 lg:mx-3 md:mx-3 px-2 py-3'>
          <OrderTransit order={order} currentStatus={currentStatus} shipmentStatusNo={shipmentStatusNo} />

        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
