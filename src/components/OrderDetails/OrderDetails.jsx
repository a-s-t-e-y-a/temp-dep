import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { X } from 'lucide-react';

function OrderDetails({ order, onClose }) {
  const { allProducts } = useContext(StoreContext);

  // Destructure values safely from the order
  const {
    items = [],
    createdAt = '',
    totalAmount,
    orderId,
    address,
    promoCodeUsed,
    discountApplied,
  } = order;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Right drawer */}
      <div className="fixed top-[45px] right-0 w-full max-w-sm h-full rounded-t-[15px] lg:rounded-none md:rounded-none bg-white z-50 shadow-lg  overflow-y-auto hide-scrollbar transition-transform duration-300 translate-x-0">
        {/* Fixed Header */}
<div className="border-b sticky top-0 bg-white z-10">
  <div className="px-4 pt-4 pb-3 flex items-center">
    <h2 className="text-[18px] font-[500] flex-1">Order Details</h2>
    <span
      className="text-[14px] text-[#6A6A6A] font-medium mr-4"
      style={{ minWidth: 110, textAlign: 'right' }}
    >
      {formatDate(createdAt)}
    </span> 
    <button
      onClick={onClose}
      className="ml-2"
    >
      <X className="lg:hover:text-black text-[#6A6A6A] text-[18px]" />
    </button>
  </div>
</div>

        {/* Order Meta */}
        <div className='px-4 mt-2 mb-3'>
          <p className='text-[16px] text-[#6A6A6A] mb-1 pb-0'>Order ID - {orderId}</p>
        </div>

        {/* Items */}
        <div className='px-4 mb-3'>
          <div className='border rounded-[15px]'>
            {items.map((item, idx) => {
              const product = allProducts.find(
                p => p._id === item.foodId || p.id === item.foodId
              );
              return (
                <div key={idx} className="flex items-center gap-4 border-b last:border-b-0">
                  <img
                    src={product?.imageUrl || assets.placeholder}
                    alt={product?.name || 'Product'}
                    className="h-[70px] max-w-full ml-3 my-2 object-cover"
                  />
                  <div className='mb-8'>
                    <p className="font-[500] text-[16px] mb-0 pb-0">{item.name || 'Unknown Product'}</p>
                    <p className="text-[14px] text-[#6A6868F0] mb-0 pb-0">{product?.unit || ''}</p>
                    <p className="text-[13px] text-[#6A6868F0] mb-0 pb-0">Qty: {item.quantity}</p>
                    <p className="text-[13px] text-[#6A6868F0] mb-0 pb-0">₹{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address */}
        <div className='px-4'>
          <div className="mb-3 border rounded-[15px] border-[#D9D9D9] px-3 py-2">
            <h3 className="font-[700] text-[16px] text-black mb-1">Delivery Details</h3>
            {address ? (
              <div className='flex items-center mb-0'>
                <img src={assets.home} loading="lazy" className='h-6 w-6 inline-block mr-4' alt="Home" />
                <div className='flex flex-col'>
                  <span className="text-[14px] font-[600] pb-0 mb-0 text-black">
                    {address.label || address.recipientName || ''}
                  </span>
                  <div className="text-[11px] font-[600] text-[#6A6868]">
                    {[
                      address.floor,
                      address.street,
                      address.buildingName,
                      address.towerRing,
                      address.landmark,
                      address.city,
                      address.state,
                      address.pincode,
                      address.country
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {address.recipientPhoneNumber && (
                    <div className="text-[11px] font-[600] text-[#6A6868]">
                      {address.recipientPhoneNumber}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-[#6A6868F0]">No address info</div>
            )}
          </div>
        </div>

        {/* Grand Total */}
        <div className='px-4 pb-4'>
          <div className='mb-12 border rounded-[15px] border-[#D9D9D9]'>
            <div className='px-3 pt-2 pb-3'>
              <div className="flex justify-between">
                <span className="font-[600] text-[18px] text-black pt-0">Grand Total</span>
                <span className="font-[700] text-[15px] text-[#000000C7] pt-0">₹{totalAmount}</span>
              </div>
              {discountApplied > 0 && (
                <p className="text-white text-[12px] bg-[#4D8FE3] border rounded p-1 font-[600] mt-1 max-w-[150px] text-center mb-0">
                  You Saved ₹{discountApplied.toFixed(2)}
                </p>
              )}
              <p className="text-[13px] text-[#000000C2] font-[500] mt-1">
                Including all taxes & charges
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
