import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const AddToCartDrawer = () => {
  const {
    showDrawer,
    setShowDrawer,
    allProducts,
    quantites,
    setShowCart,
    isDrawerHovered,
    setIsDrawerHovered
  } = useContext(StoreContext);

  const cartItems = (allProducts || []).filter((item) => (quantites?.[item.id] || 0) > 0).map((item) => ({
    ...item,
    quantity: quantites[item.id] || 0,
  }));

  if (!showDrawer || cartItems.length === 0) return null;

  return (
    <div 
      onMouseEnter={() => setIsDrawerHovered(true)}
      onMouseLeave={() => setIsDrawerHovered(false)}
      onScroll={() => setIsDrawerHovered(true)}
      className="hidden md:flex lg:flex fixed top-[120px] right-4 bg-white  shadow-lg z-50 rounded-lg w-[435px] max-h-[72vh] flex flex-col"
    >
      {/* Larger Triangle Pointer */}
      <div className="absolute -top-5 lg:right-9 md:right-5">
  <div className="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[32px] border-transparent border-b-white rounded-sm"></div>
</div>



      <div className="px-4 py-2 border-b text-[#33C60A] text-[18px] font-[500]">Added to cart</div>
      
      <div className="overflow-y-auto px-4 py-1 flex-1  hide-scrollbar">
        <div className="flex-1 overflow-y-auto px-4 py-1"></div>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 mt-3 pb-0">
            <img
              src={item.imageUrl}
              className="w-[95px] h-[92px] object-contain rounded px-2"
              alt={item.name}
            />
            <div className="flex-1">
              <div className="font-[500] text-[14px] text-black mb-0 mt-0">{item.name}</div>
              <div className="font-[500] text-[14px] text-[#7B7B7B] mb-0">{item.unit}</div>
              {item.discountedPrice > 0 && item.discountedPrice < item.price ? (
                <>
                  {item.discountPercent > 0 && (
                    <div className="text-[#3149A6] text-[12px] font-[500]">{item.discountPercent}% off</div>
                  )}
                  <div className="flex flex-row gap-3">
                    <div className="text-black text-[14px] font-semibold">₹{item.discountedPrice.toFixed(2)}</div>
                    <div className="text-[14px] line-through text-[#00000091] font-[400]">₹{item.price.toFixed(2)}</div>
                  </div>
                </>
              ) : (
                <div className="text-black text-[14px] font-semibold mb-3">₹{item.price.toFixed(2)}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white rounded-b-lg">
        <button
          onClick={() => {
            setShowCart(true);
            setShowDrawer(false);
          }}
          className="w-[400px] bg-white lg:hover:bg-blue-200 text-center py-2 text-[#0C5273] font-semibold border-2 border-[#0C5273] m-3 rounded-lg transition-colors duration-300"
        >
          Go to Cart
        </button>
      </div>

      <button onClick={() => setShowDrawer(false)} className="absolute top-1 right-6 text-[#7B7B7B] text-2xl lg:hover:text-black">×</button>
    </div>
  );
};

export default AddToCartDrawer;
