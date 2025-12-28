// OrderCard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import OrderDetails from '../OrderDetails/OrderDetails';
import TrackOrder from '../TrackOrder/TrackOrder';
const API_BASE =  import.meta.env.VITE_API_URL;
const statusAssets = {
  Delivered: {
    icon: assets.delivered,
    title: "Arrived on",
    showReorder: true,
  },
  Cancelled: {
    icon: assets.cancelled,
    title: "Cancelled on",
    showReorder: false,
  },
  Transit: {
    icon: assets.intransit,
    title: "Order in-transit",
    showReorder: false,
  },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const OrderCard = ({ order }) => {
  const { allProducts, setShowCart, loadCartData } = useContext(StoreContext);
  const { idToken } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [liveStatusKey, setLiveStatusKey] = useState('Transit');
  const [shipmentStatusNo, setShipmentStatusNo] = useState(null);

  const { totalAmount, createdAt, items, orderId } = order;

  const getProductImage = (foodId) => {
    const product = allProducts.find(p => p.id === foodId);
    return product?.imageUrl || assets.placeholder;
  };

  const fetchLiveStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/track`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        }
      });

      if (!res.ok) throw new Error("Failed to fetch tracking data");

      const data = await res.json();
      const tracking = data?.tracking_data;
      const status = tracking?.shipment_track?.[0]?.current_status || 'Unknown';

      setCurrentStatus(status);
      setShipmentStatusNo(tracking?.shipment_status);

      if (status === "Delivered") setLiveStatusKey("Delivered");
      else if (status === "Canceled") setLiveStatusKey("Cancelled");
      else setLiveStatusKey("Transit");
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setLiveStatusKey("Transit");
    }
  };

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const statusInfo = statusAssets[liveStatusKey] || {};

  const handleReorder = async () => {
    if (!idToken) return console.error("User not logged in");

    const itemsPayload = {};
    order.items.forEach((item) => {
      itemsPayload[item.foodId] = item.quantity;
    });

    try {
      const response = await fetch(`${API_BASE}/api/cart/add-multiple-foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ items: itemsPayload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to reorder:", errorData);
        return;
      }
      await loadCartData();
      setShowCart(true);
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  return (
    <>
      <div className='w-full my-2 sm:bg-white md:bg-[#F4F4F4] lg:bg-[#F4F4F4] border lg:border-0 md:border-0 border-[#D9D9D9] rounded-[10px] pt-2 pb-0'>
        {/* Header */}
        <div className='flex items-center justify-between px-2 pt-0 pb-2 border-b border-[#D9D9D98F]'>
          <div className='flex items-center gap-2 '>
            <img src={statusInfo.icon} alt="status icon" loading="lazy" className='max-w-full h-[30px]' />
            <div>
              <div className='font-[700] text-black text-[15px]'>
                {statusInfo.title} {liveStatusKey !== "Transit" && ` ${formatDate(createdAt)}`}
              </div>
              <div className='text-[#777777] text-[12px]'>₹{totalAmount}</div>
            </div>
          </div>
        </div>

        {/* Product Thumbnails */}
        <div className='py-2 border-b border-[#D9D9D98F]'>
          <div className='mx-2 flex items-center gap-3 '>
            {items.slice(0, 8).map((item, index) => (
              <img key={index} src={getProductImage(item.foodId)} alt={item.name} className='max-w-full h-[65px] object-contain hidden bg-white lg:block md:hidden rounded p-1.5' />
            ))}
            {items.slice(0, 4).map((item, index) => (
              <img key={index} src={getProductImage(item.foodId)} alt={item.name} className='max-w-full h-[60px] object-contain bg-[#F4F4F4] block lg:hidden md:hidden rounded p-1.5' />
            ))}
            {items.slice(0, 5).map((item, index) => (
              <img key={index} src={getProductImage(item.foodId)} alt={item.name} className='max-w-full h-[65px] object-contain bg-white lg:hidden md:block hidden rounded p-1.5' />
            ))}
            {items.length > 5 && (
              <div className="text-[13px] text-[#0C5273] font-[700]">
                <button className='ml-0 pl-0 hidden lg:hidden md:block ' onClick={() => setShowDetails(true)}>+{items.length - 5} more</button>
              </div>
            )}
            {items.length > 8 && (
              <div className="text-[14px] text-[#0C5273] font-[700]">
                <button className='ml-0 pl-0 hidden lg:block md:hidden ' onClick={() => setShowDetails(true)}>+{items.length - 8} more</button>
              </div>
            )}
            {items.length > 4 && (
              <div className="text-[12px] ml-0 pl-0 text-[#0C5273] font-[700]">
                <button className='ml-0 mr-4 lg:hidden md:hidden block' onClick={() => setShowDetails(true)}>+{items.length - 4} more</button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className='flex'>
          <div
            className='text-[#0C5273] py-2 w-1/2 lg:text-[15px] md:text-[15px] text-[13px] text-center font-[700] cursor-pointer'
            onClick={() =>
              liveStatusKey === "Transit" ? setShowTrack(true) :
              handleReorder()
            }
          >
            {liveStatusKey === "Transit" ? "Track Order" : "Reorder"}
          </div>
          <div className='border-l border-[#D9D9D98F]'></div>
          <div
            className='text-[#0C5273] py-2 w-1/2 lg:text-[15px] md:text-[15px] text-[13px] text-center font-[700] cursor-pointer'
            onClick={() => setShowDetails(true)}
          >
            View Details
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetails && (
        <OrderDetails order={order} onClose={() => setShowDetails(false)} />
      )}
      {showTrack && (
        <TrackOrder
          currentStatus={currentStatus}
          shipmentStatusNo={shipmentStatusNo}
          order={order}
          onClose={() => setShowTrack(false)}
        />
      )}
    </>
  );
};

export default OrderCard;
