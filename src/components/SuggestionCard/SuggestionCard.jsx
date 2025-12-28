import React from 'react';

const SuggestionCard = ({ item, onAddToCart }) => {
  return (
    <div className="border border-[#D9D9D9] rounded-lg px-2 py-2 lg:w-[110px] lg:h-[245px] h-[220px] w-[100px] flex flex-col items-center justify-between">
      {/* Image */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full lg:h-[90px] h-[70px] object-contain"
      />

      {/* Spacer before name */}
      <div className="mt-2 h-[30px] lg:h-[40px] text-center flex items-center justify-center">
        <p className="text-[12px] lg:text-[14px] font-[500] text-black line-clamp-2 min-h-[35px]">
          {item.name}
        </p>
      </div>

      {/* Price */}
{item.discountPercent > 0 && (
                                    <div className="text-[#3149A6]  text-[11px] font-[500] text-center">
                                        {item.discountPercent}% off
                                    </div>
                                )}
      {item.discountedPrice && item.discountedPrice > 0 && item.discountedPrice < item.price ? (
                        <>
                            <div className="text-[11px] font-[600] text-center text-black">
                                ₹{item.discountedPrice.toFixed(2)} <div className='line-through font-[400] text-[9px] text-[#00000091]  mb-2 '>MRP ₹{item.price.toFixed(2)}</div>
                            </div>
                            
                            
                            
                        </>
                    ) : (
                        <>
                            <div className="text-[11px] font-[600] text-center text-black  mb-[35px]">
                                ₹{item.price.toFixed(2)}
                            </div>
                            
                        </>
                    )}

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(item.id)}
        className="w-full py-1 bg-white rounded font-semibold text-[12px] border-2 border-[#0C5273] text-[#0C5273] "
      >
        Add to Cart
      </button>
    </div>
  );
};

export default SuggestionCard;
