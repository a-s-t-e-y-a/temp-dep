import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import { GoChevronDown } from "react-icons/go";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useClickSpark } from '../ClickSpark/useClickSpark';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import bg from '../../assets/bg.png';
import { useAuth } from '../../context/AuthContext';

// ✅ CHANGE 1: Added `category` prop to component signature
const ProductCard = ({ name, id, imageUrl, title = [], onClick, category }) => {
  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } = useContext(CartContext);
  const { foodList } = useContext(StoreContext);
  const { idToken } = useAuth();
  const navigate = useNavigate();
  const triggerSpark = useClickSpark();
  const cardRef = useRef(null);

  // ✅ CHANGE 2: Added `disabled` state derived from category
  const disabled = useMemo(() => {
    const c = String(category || '').trim();
    return c === 'Cake & Muffins' || c === 'Pratham';
  }, [category]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power1.out' });
    }
  }, []);

  const catalogVariants = useMemo(() => {
    if (!Array.isArray(foodList)) return [];
    const byId = foodList.filter(v => String(v?.id) === String(id));
    if (byId.length > 0) return byId;
    return foodList.filter(v => v?.name === name);
  }, [foodList, id, name]);

  const ready = useMemo(() => {
    if (catalogVariants.length === 0) return false;
    return catalogVariants.some(v => Number.isFinite(Number(v?.price)));
  }, [catalogVariants]);

  const [selectedVariant, setSelectedVariant] = useState(() => (catalogVariants[0] || null));
  
  // ✅ CHANGE 3: Added missing `showWeightDropdown` state
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);

  useEffect(() => {
    if (catalogVariants.length === 0) return;
    setSelectedVariant(prev => {
      if (!prev) return catalogVariants[0];
      const keep = catalogVariants.find(v => v.unit === prev.unit) || catalogVariants[0];
      return keep;
    });
  }, [catalogVariants]);

  if (!ready || !selectedVariant) {
    return (
      <div className="relative flex flex-col border border-[#D9D9D9] lg:w-[270px] lg:h-[540px] md:w-[215px] md:h-[420px] w-[150px] h-[300px] animate-pulse">
        <div className="bg-[#F3EEEA] lg:h-[233px] h-[180px]" />
        <div className="p-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  const {
    id: selectedId,
    price,
    discountedPrice,
    discountPercent = 0,
    unit = ''
  } = selectedVariant;

  const base = Number(price);
  const disc = Number(discountedPrice);
  const hasBase = Number.isFinite(base);
  const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;

  // ✅ CHANGE 4: Added guard to prevent navigation when disabled
  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      navigate(`/food/${encodeURIComponent(id)}`);
    }
  };

  // ✅ CHANGE 5: Added guard to prevent add-to-cart when disabled
  const handleAddToCart = (e) => {
    if (disabled || !selectedId) return;
    triggerSpark(e, '#ffffff');
    increaseQty(selectedId, idToken);
    const priceToCharge = hasDisc ? disc : hasBase ? base : 0;
    triggerCartDrawer({
      id: selectedId,
      name,
      imageUrl,
      unit,
      price: priceToCharge,
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
    // ✅ CHANGE 6: Added conditional classes for grey-out effect and disabled pointer events
    <div
      ref={cardRef}
      className={`relative flex flex-col border border-[#D9D9D9] lg:w-[270px] lg:h-[540px] md:w-[215px] md:h-[420px] w-[150px] h-[300px] justify-between item-center ${
        disabled ? 'pointer-events-none opacity-60 grayscale' : ''
      }`}
      aria-disabled={disabled}
    >
      {title?.length > 0 && (
        <div className={`absolute top-0 left-0 text-white px-2 py-1 text-center text-[12px] md:text-[14px] lg:text-[16px]  w-[100px] md:w-[110px] lg:w-[130px] rounded-br font-semibold capitalize z-10 ${titleColors[title[0]] || 'bg-[#B7275E]'}`}>
          {title[0]}
        </div>
      )}

      <div className="flex justify-center items-center mb-2 bg-[#F3EEEA] rounded-b-[20px] lg:w-[268.75px] md:w-[213.75px] lg:h-[233px] w-[148.5px] h-[180px]">
        {/* ✅ CHANGE 7: Added cursor state for disabled */}
        <div
          onClick={handleClick}
          className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <img
            src={imageUrl}
            loading="lazy"
            className={`w-120 lg:h-[150px] md:w-[130px] md:h-[140px] h-[80px] lg:hover:scale-125 transition-all duration-500 ${
              disabled ? '' : 'cursor-pointer'
            }`}
            alt={name}
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
                <span className="line-through text-[12px] md:text-[16px] lg:text-[18px] text-[#00000091] font-[400]">MRP ₹{base.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="text-[12px] md:text-[16px] lg:text-[18px] text-[#3149A6] font-[400] text-center">
                  {discountPercent.toFixed(0)}% off
                </div>
              )}
            </>
          ) : (
            <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
              ₹{base.toFixed(2)}
            </div>
          )
        ) : (
          <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">—</div>
        )}

        <div className='text-[14px] md:text-[17px] lg:text-[19px] font-[400] text-black text-left mx-2.5 md:mx-4 lg:mx-[23px] pt-2'>
          Weight :
        </div>

        <div className="relative mx-2.5 md:mx-4 lg:mx-[23px] mt-1 z-20">
          {catalogVariants.length > 1 ? (
            <>
              {/* ✅ CHANGE 8: Added disabled attribute and guard to weight dropdown button */}
              <button
                className="lg:w-[90px] md:w-[80px] w-[50px] h-6 md:h-7 lg:h-10 sm:py-0 md:py-2 lg:py-1 bg-white text-black font-[600] text-left text-[14px] md:text-[15px] lg:text-[19px] rounded-[6px] flex justify-between items-center disabled:opacity-60"
                onClick={() => !disabled && setShowWeightDropdown(prev => !prev)}
                onBlur={() => setTimeout(() => setShowWeightDropdown(false), 200)}
                disabled={disabled}
              >
                {unit || 'Select weight'} <GoChevronDown strokeWidth={1} className='lg:pt-1'/>
              </button>

              {/* ✅ CHANGE 9: Hide dropdown when disabled */}
              {showWeightDropdown && !disabled && (
                <ul className="absolute bg-white shadow-md rounded border border-[#D9D9D93D] lg:w-[90px] md:w-[80px] w-[50px] max-h-[160px] px-0 mx-0 overflow-y-auto">
                  {catalogVariants.map((variant) => (
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
          {/* ✅ CHANGE 10: Hide quantity controls when disabled */}
          {quantites[selectedId] > 0 && !disabled ? (
            <div className="flex items-center mt-2 mb-3 mx-2.5 md:mx-4 lg:mx-[23px]">
              <button
                className="w-[25px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[40px] h-6 lg:h-10 text-[14px] lg:text-[18px] border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-l"
                onClick={() => decreaseQty(selectedId, idToken)}
              >
                <FiMinus />
              </button>
              <input
                type="text"
                readOnly
                value={quantites[selectedId]}
                className="w-[80px] md:h-7 md:w-[116px] lg:w-[140px] h-6 lg:h-10 text-[14px] lg:text-[18px] text-center border-y-2 border-[#0C5273] rounded-[0px] text-white bg-[#0C5273] font-[500]"
              />
              <button
                className="w-[25px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[40px] h-6 lg:h-10 text-[14px] lg:text-[18px] border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-r"
                onClick={handleAddToCart}
              >
                <FiPlus />
              </button>
            </div>
          ) : (
            // ✅ CHANGE 11: Conditional styling and text for "Add To Cart" / "Out of stock" button
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

export default ProductCard;
