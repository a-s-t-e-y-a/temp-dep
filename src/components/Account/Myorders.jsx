import React from 'react';
import { GoChevronLeft } from 'react-icons/go';
import OrderCard from '../OrderCard/OrderCard.jsx';
import { assets } from '../../assets/assets.js';

const MyOrders = ({ orders, onBack }) => (
  <>
    {/* Mobile orders */}
    <div className="lg:hidden md:hidden fixed top-0 right-0 w-full h-full z-50 bg-white transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="text-[20px] font-[700] px-3 py-3">
        <div className="flex ml-0 pl-0 gap-2 py-2">
          <button onClick={onBack} className="ml-0 pl-0 mr-2">
            <GoChevronLeft size={28} strokeWidth={1} />
          </button>
          <div>My Orders</div>
        </div>
        {orders.length === 0 ? (
          <div className="place-items-center my-16 text-center">
            <img src={assets.bag} alt="Orders" className="max-w-full h-[200px] mb-1 opacity-50 mx-auto" />
            <p className="text-[20px] font-[500] text-[#85858596]">NO ORDERS YET</p>
          </div>
        ) : (
          <div className="space-y-0 my-2 mx-1 overflow-y-auto hide-scrollbar">
            <div className="space-y-0 my-2 mx-3 max-h-[350px] overflow-y-auto hide-scrollbar">
              {['Delivered', 'Out for Delivery', 'Cancelled'].map((status2) =>
                orders
                  .filter((order) => order.status2 === status2)
                  .map((order, index) => (
                    <OrderCard key={`${status2}-${order.orderId}-${index}`} order={order} />
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    {/* Desktop orders */}
    <div className="hidden lg:w-full md:w-[500px] lg:max-w-2xl lg:block md:block bg-white border-2 border-[#D9D9D9] rounded-[15px]">
      <div className="text-left lg:w-full md:w-[467px] max-w-2xl">
        <div className="border-b-2 border-[#D9D9D9] mb-0">
          <h2 className="text-[22px] font-[600] mb-0 mt-0 py-2 px-4">My Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="place-items-center my-16 text-center">
            <img src={assets.bag} alt="Orders" className="max-w-full h-[200px] mb-1 opacity-50 mx-auto" />
            <p className="text-[20px] font-[500] text-[#85858596]">NO ORDERS YET</p>
          </div>
        ) : (
          <div className="space-y-0 my-2 mx-3 max-h-[350px] overflow-y-auto hide-scrollbar">
            {['Delivered', 'Out for Delivery', 'Cancelled'].map((status2) =>
              orders
                .filter((order) => order.status2 === status2)
                .map((order, index) => (
                  <OrderCard key={`${status2}-${order.orderId}-${index}`} order={order} />
                ))
            )}
          </div>
        )}
      </div>
    </div>
  </>
);

export default MyOrders;
