import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import { GoChevronDown } from "react-icons/go";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useClickSpark } from '../ClickSpark/useClickSpark';
import bg from '../../assets/bg.png'; // adjust path as needed
const DisplayCard = ({ name, id, imageUrl,title=[] }) => {
  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } = useContext(CartContext);
  const { foodList } = useContext(StoreContext);

  const weightVariants = useMemo(
    () => foodList.filter(item => item.name === name),
    [foodList, name]
  );

  const [selectedVariant, setSelectedVariant] = useState(weightVariants[0] || {});
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
const triggerSpark = useClickSpark();
  const {
    id: selectedId,
    price = 0,
    discountedPrice = 0,
    discountPercent = 0,
    unit = ''
  } = selectedVariant;

  const handleAddToCart = (e) => {
    triggerSpark(e, '#ffffff');
    increaseQty(selectedId);
    triggerCartDrawer({
      id: selectedId,
      name,
      imageUrl,
      unit,
      price: discountedPrice > 0 && discountedPrice < price ? discountedPrice : price,
    });
  };
  const titleColors = {
  'Trending': 'bg-[#AD1457]',
  'Bestseller': 'bg-[#3E4261]',
  'Gifting': 'bg-[#6A1B4D]',
  'Fasting': 'bg-[#3A4A3F]',
  'Bought Earlier': 'bg-[#6E2C00]',
  'New Launched': 'bg-[#4A148C]'
};


   return (
      <div className="relative flex flex-col border border-[#D9D9D9] lg:w-[270px] lg:h-[540px] md:w-[215px] md:h-[420px] w-[150px] h-[300px] justify-between item-center">
        
        {/* Tag badge */}
       {title?.length > 0 && (
  <div className={`absolute top-0 left-0 text-white px-2 py-1 text-center text-[12px] md:text-[14px] lg:text-[16px]  w-[100px] md:w-[110px] lg:w-[130px] rounded-br font-semibold capitalize z-10 ${titleColors[title[0]] || 'bg-[#B7275E]'}`}>
    {title[0]}
  </div>
)}

        {/* Product image */}
        <div className="flex justify-center items-center mb-2 bg-[#F3EEEA] rounded-b-[20px] lg:w-[268.75px] md:w-[213.75px] lg:h-[233px] w-[148.5px] h-[180px]">
          <Link to={`/food/${selectedId}`}>
            <img
              src={imageUrl}
              className="w-120 lg:h-[160px] md:h-[130px] h-[80px] lg:hover:scale-125 transition-all duration-500 cursor-pointer"
              alt={name}
            />
          </Link>
        </div>
  
  
        <div>
          <h6 className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-black text-wrap pt-0 px-3 text-center line-clamp-2 min-h-[35px] md:min-h-[48px] lg:min-h-[56px]">{name}</h6>
  
          {discountedPrice > 0 && discountedPrice < price ? (
            <>
              <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
                <span>₹{discountedPrice.toFixed(2)} </span>
                <span className='line-through text-[12px] md:text-[16px] lg:text-[18px] text-[#00000091] font-[400]'>MRP ₹{price.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="text-[12px] md:text-[16px] lg:text-[18px] text-[#3149A6] font-[400] text-center">
                  {discountPercent}% off
                </div>
              )}
            </>
          ) : (
            <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
              ₹{price.toFixed(2)}
            </div>
          )}
  
          <div className='text-[14px] md:text-[17px] lg:text-[19px] font-[400] text-black text-left mx-2.5 md:mx-4 lg:mx-[23px] pt-2'>
            Weight : 
          </div>
  
            <div className="relative mx-2.5 md:mx-4 lg:mx-[23px] mt-1 z-20">
  {weightVariants.length > 1 ? (
    <>
      <button
        className="lg:w-[90px] md:w-[80px] w-[50px] h-6 md:h-7 lg:h-10 sm:py-0 md:py-2 lg:py-1 bg-white
        text-black font-[600] text-left   text-[14px] md:text-[15px] lg:text-[19px] rounded-[6px]  flex justify-between items-center"
        onClick={() => setShowWeightDropdown(prev => !prev)}
        onBlur={() => setTimeout(() => setShowWeightDropdown(false), 200)}
      >
        {unit || 'Select weight'} <GoChevronDown strokeWidth={1} className='lg:pt-1'/>
      </button>

      {showWeightDropdown && (
        <ul className="absolute bg-white shadow-md rounded border border-[#D9D9D93D] lg:w-[90px] md:w-[80px] w-[50px] max-h-[160px] px-0 mx-0 overflow-y-auto">
          {weightVariants.map((variant) => (
            <li
              key={variant.id}
              className="border-b last:border-b-0 px-2 mx-0 lg:hover:bg-gray-100"
            >
              <button
                className="block w-full text-left text-[11px] md:text-[13px] lg:text-[15px] px-0 mx-0 lg:py-2 py-1 text-black"
                onMouseDown={() => {
                  setSelectedVariant(variant);
                  setShowWeightDropdown(false);
                }}
              >
                {variant.unit}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  ) : (
    <div className="lg:w-[90px] md:w-[80px] w-[50px] h-6 md:h-7 lg:h-10 bg-white text-black font-[600] text-left text-[14px] md:text-[15px] lg:text-[19px] rounded-[6px]  flex items-center">
      {unit}
    </div>
  )}
</div>

  
          <div>
            {quantites[selectedId] > 0 ? (
              <div className="flex items-center mt-2 mb-3 mx-2.5 md:mx-4 lg:mx-[23px]">
                <button
                  className="w-[25px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[40px] h-6 lg:h-10 text-[14px] lg:text-[18px] lg:py-2 lg:px-3 border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-l"
                  onClick={() => decreaseQty(selectedId)}
                >
                  <FiMinus />
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantites[selectedId]}
                  className="w-[80px] md:h-7 md:w-[116px] md:text-[16px] lg:w-[140px] h-6 lg:h-10 text-[14px] lg:text-[18px] text-center border-y-2 border-[#0C5273] rounded-[0px] text-white bg-[#0C5273] font-[500]"
                />
                <button
                  className="w-[25px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[40px] h-6 lg:h-10 text-[14px] lg:text-[18px] lg:p-2 border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-r"
                  onClick={handleAddToCart}
                >
                  <FiPlus />
                </button>
              </div>
            ) : (
             <button
              style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'repeat-x',
                backgroundPosition: '0 -100%',
                transition: 'background-position 1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = '150% 100%')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = '0 -100%')}
                className="lg:w-[220px] md:w-[180px] w-[130px] h-6 md:h-7 lg:h-10 bg-white rounded-[3px] font-semibold text-[12px] md:text-[16px] lg:text-[18px] mx-2.5 md:mx-4 lg:mx-[23px] lg:border-[2px] md:border-[2px] border-[1px] border-[#0C5273] text-[#0C5273] mb-3 mt-2 lg:hover:text-white"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default DisplayCard;