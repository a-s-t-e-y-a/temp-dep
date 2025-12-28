import React, { useContext, useState, useMemo, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { GoChevronDown } from "react-icons/go";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useClickSpark } from '../ClickSpark/useClickSpark';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import bg from '../../assets/bg.png';


const SearchCard = ({
  id,
  name,
  imageUrl,
  title = [],
  onClick,
  category,
  price: propPrice,
  discountedPrice: propDisc,
  unit: propUnit
}) => {
  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } = useContext(CartContext);
  const { foodList } = useContext(StoreContext);
  const navigate = useNavigate();
  const triggerSpark = useClickSpark();

  const disabled = useMemo(() => {
    const c = String(category || '').trim();
    return c === 'Cake & Muffins' || c === 'Pratham';
  }, [category]);

  const weightVariants = useMemo(
    () => (Array.isArray(foodList) ? foodList.filter(item => item?.name === name) : []),
    [foodList, name]
  );

  const fallbackVariant = useMemo(() => {
    const base = Number(propPrice);
    const disc = Number(propDisc);
    const hasBase = Number.isFinite(base);
    const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;

    return {
      id,
      name,
      imageUrl,
      unit: propUnit || '',
      price: hasBase ? base : undefined,
      discountedPrice: hasDisc ? disc : undefined,
      discountPercent: hasDisc && hasBase ? Math.round(((base - disc) / base) * 100) : 0
    };
  }, [id, name, imageUrl, propPrice, propDisc, propUnit]);

  const initialVariant = weightVariants[0] || fallbackVariant;
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);

  useEffect(() => {
    if (weightVariants.length > 0) {
      setSelectedVariant(prev => {
        if (prev?.unit) {
          const match = weightVariants.find(v => v.unit === prev.unit) || weightVariants[0];
          return match;
        }
        return weightVariants[0];
      });
    } else {
      setSelectedVariant(fallbackVariant);
    }
  }, [weightVariants, fallbackVariant]);

  const selectedId = selectedVariant?.id ?? id;

  const base = Number(selectedVariant?.price);
  const disc = Number(selectedVariant?.discountedPrice);
  const hasBase = Number.isFinite(base);
  const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;
  const unit = selectedVariant?.unit || '';

  const handleNavigate = () => {
    if (disabled) return;
    if (onClick) onClick();
    else navigate(`/food/${encodeURIComponent(id)}`);
  };

  const handleAddToCart = (e) => {
    if (disabled || !selectedId) return;
    triggerSpark(e, '#ffffff');
    increaseQty(selectedId);
    const priceToCharge = hasDisc ? disc : hasBase ? base : 0;
    triggerCartDrawer({
      id: selectedId,
      name,
      imageUrl,
      unit,
      price: priceToCharge
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
    <div
      className={`relative flex flex-col border border-[#D9D9D9] lg:w-full lg:h-[560px] md:w-[215px] md:h-[420px] w-[150px] h-[300px] justify-between item-center ${
        disabled ? 'pointer-events-none opacity-60 grayscale' : ''
      }`}
      aria-disabled={disabled}
    >
      {Array.isArray(title) && title.length > 0 && (
        <div className={`absolute top-0 left-0 text-white px-2 py-1 text-center text-[12px] md:text-[14px] lg:text-[16px]  w-[100px] md:w-[110px] lg:w-[130px] rounded-br font-semibold capitalize z-10 ${titleColors[title[0]] || 'bg-[#B7275E]'}`}>
          {title[0]}
        </div>
      )}

      <div className="flex justify-center items-center mb-2 bg-[#F3EEEA] rounded-b-[20px] w-full lg:h-[250px] md:h-[180px] h-[180px]">
        <div
          onClick={handleNavigate}
          className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <img
            src={imageUrl}
            className={`w-auto lg:h-[170px] md:w-[130px] md:h-[140px] h-[80px] lg:hover:scale-125 transition-all duration-500 ${
              disabled ? '' : 'cursor-pointer'
            }`}
            alt={name}
            loading="lazy"
          />
        </div>
      </div>

      <div>
        <h6 className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-black text-wrap pt-0 px-3 text-center line-clamp-2 min-h-[35px] md:min-h-[48px] lg:min-h-[56px]">
          {name}
        </h6>

        {hasBase ? (
          hasDisc ? (
            <>
              <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
                <span>₹{disc.toFixed(2)} </span>
                <span className='line-through text-[12px] md:text-[16px] lg:text-[18px] text-[#00000091] font-[400]'>MRP ₹{base.toFixed(2)}</span>
              </div>
              {Math.round(((base - disc) / base) * 100) > 0 && (
                <div className="text-[12px] md:text-[16px] lg:text-[18px] text-[#3149A6] font-[400] text-center">
                  {Math.round(((base - disc) / base) * 100)}% off
                </div>
              )}
            </>
          ) : (
            <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
              ₹{base.toFixed(2)}
            </div>
          )
        ) : (
          <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
            —
          </div>
        )}

        <div className='text-[14px] md:text-[17px] lg:text-[19px] font-[400] text-black text-left mx-2.5 md:mx-4 lg:mx-[23px] pt-2'>
          Weight :
        </div>

        <div className="relative mx-2.5 md:mx-4 lg:mx-[23px] mt-1 z-20">
          {weightVariants.length > 1 ? (
            <>
              <button
                className="lg:w=[90px] md:w-[80px] w-[50px] h-6 md:h-7 lg:h-10 bg-white text-black font-[600] text-left text-[14px] md:text-[15px] lg:text-[19px] rounded-[6px] flex justify-between items-center disabled:opacity-60"
                onClick={() => !disabled && setShowWeightDropdown(prev => !prev)}
                onBlur={() => setTimeout(() => setShowWeightDropdown(false), 200)}
                disabled={disabled}
              >
                {unit || 'Select weight'} <GoChevronDown strokeWidth={1} className='lg:pt-1'/>
              </button>

              {showWeightDropdown && !disabled && (
                <ul className="absolute bg-white shadow-md rounded border border-[#D9D9D93D] lg:w-[90px] md:w-[80px] w-[50px] max-h-[160px] px-0 mx-0 overflow-y-auto">
                  {weightVariants.map((variant) => (
                    <li key={variant.id} className="border-b last:border-b-0 px-2 mx-0 lg:hover:bg-gray-100">
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
            <div className="lg:w-[90px] md:w-[80px] w-[50px] h-6 md:h-7 lg:h-10 bg-white text-black font-[600] text-left text-[14px] md:text-[15px] lg:text-[19px] rounded-[6px] flex items-center">
              {unit || '—'}
            </div>
          )}
        </div>

        <div>
          {quantites[selectedId] > 0 && !disabled ? (
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
              onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundPosition = '150% 100%')}
              onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundPosition = '0 -100%')}
              className={`lg:w-[220px] md:w-[180px] w-[130px] h-6 md:h-7 lg:h-10 rounded-[3px] font-semibold text-[12px] md:text-[16px] lg:text-[18px] mx-2.5 md:mx-4 lg:mx-[23px] lg:border-[2px] md:border-[2px] border-[1px] mb-3 mt-2 ${
                disabled
                  ? 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-white border-[#0C5273] text-[#0C5273] lg:hover:text-white'
              }`}
              onClick={handleAddToCart}
              disabled={disabled}
            >
              {disabled ? 'Out of stock' : 'Add To Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default SearchCard;
