import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useClickSpark } from '../ClickSpark/useClickSpark';
import { useAuth } from '../../context/AuthContext';
import { faViewItemList } from '../../analytics/ga4';
import bg from '../../assets/bg.png'; // adjust path as needed

const API_BASE =  import.meta.env.VITE_API_URL;

const BestsellingCombos = () => {
  const [comboItems, setComboItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const triggerSpark = useClickSpark();
  const { idToken } = useAuth();
  const {
    increaseQty,
    decreaseQty,
    quantites,
    triggerCartDrawer,
  } = useContext(CartContext);

  const sectionRef = useRef(null);
  const listImpressionSentRef = useRef(false);

  const LIST_ID = "bestselling_combos_home"
  const LIST_NAME = "Bestselling Combos";

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/combos`);
        setComboItems(response.data);
      } catch (error) {
        console.error('Failed to fetch bestselling combos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

    // NEW: fire view_item_list once when grid is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (loading) return;
    if (!comboItems || comboItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
      if (!visible) return;

      if (!listImpressionSentRef.current) {
        // Build displayed items: group by name, take first variant just like render
        const grouped = comboItems.reduce((acc, item) => {
          if (!acc[item.name]) acc[item.name] = [];
          acc[item.name].push(item);
          return acc;
        }, {});
        const displayed = Object.entries(grouped).slice(0, 6).map(([name, variants]) => variants[0]);

        const items = displayed.map((product, idx) => {
          const price = product.discountedPrice > 0 && product.discountedPrice < product.price
            ? product.discountedPrice
            : product.price;
          return {
            item_id: String(product.id),
            item_name: product.name,
            item_brand: product.brand || "LetsTryFoods",
            item_category: product.category || "Combos",
            item_variant: product.unit || product.weight || undefined,
            price: Number(Number(price).toFixed(2)),
            index: idx,
            item_list_id: LIST_ID,
            item_list_name: LIST_NAME,
          };
        });

        faViewItemList({
          item_list_id: LIST_ID,
          item_list_name: LIST_NAME,
          items,
        });
        listImpressionSentRef.current = true;
      }
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [comboItems, loading]);

  const groupedCombos = comboItems.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push(item);
    return acc;
  }, {});

  return (
    <section ref={sectionRef} className="px-4 md:px-8 lg:px-16 lg:py-6 mt-0 mb-2">
      <div className="flex justify-between items-center lg:mb-4 md:mb-2 mb-2">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black">Bestselling Combos</h2>
        <button
          onClick={() => navigate('/combo')}
          className="text-sm font-medium text-[#0C5273] lg:hover:underline"
        >
          See all
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-lg">Loading...</p>
      ) : Object.keys(groupedCombos).length === 0 ? (
        <p className="text-gray-500 text-lg">No bestselling combos available.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-[60px] md:gap-[28px] gap-[10px]">
          {Object.entries(groupedCombos).slice(0, 6).map(([name, variants], index) => {
            const product = variants[0];
            const qty = quantites?.[product.id] || 0;
            const hideOnLarge = index >= 5 ? 'lg:hidden' : '';
            return (
<div
  key={product.id}
  className={`flex flex-col items-center text-center ml ${hideOnLarge}`}
>
  <div className="border lg:w[290px] md:w-[230px] w-[110px] rounded-b-[5px] md:rounded-b-[10px] lg:rounded-b-[10px] md:pb-[20px] lg:pb-[20px] pb-[15px] bg-white">
    {/* Image area: same visuals, fixed heights */}
    <div className="flex items-center justify-center bg-[#F3EEEA] rounded-b-[15px]
                    h-[90px] md:h-[180px] lg:h-[260px] w-full mb-2 overflow-hidden">
      <img
        src={product.imageUrl}
        alt={name}
        className="h-[70px] md:h-[130px] lg:h-[180px] max-w-full object-contain
                   transition-all duration-500 md:hover:scale-110 lg:hover:scale-115"
      />
    </div>

    {/* Title: identical styling, clamped to 2 lines on mobile */}
    <h3 className="mx-2 text-[12px] md:text-[20px] lg:text-[20px] font-[600] text-black leading-snug
                   min-h-[32px] md:min-h-[55px] lg:min-h-[60px] overflow-hidden"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
      {name}
    </h3>

    {/* Price: unchanged */}
        {product.discountedPrice > 0 && product.discountedPrice < product.price ? (
          <>
            <div className="text-[14px] md:text-[18px] lg:text-[16px] font-[600] text-center text-black">
              <span>₹{product.discountedPrice.toFixed(2)} </span>
              <span className="line-through text-[12px] md:text-[16px] lg:text-[16px] text-[#00000091] font-[400]">MRP ₹{product.price.toFixed(2)}</span>
            </div>
            {product.discountPercent > 0 && (
              <div className="text-[12px] md:text-[16px] lg:text-[16px] text-[#3149A6] font-[400] text-center">
                {product.discountPercent.toFixed(0)}% off
              </div>
            )}
          </>
        ) : (
          <div className="text-[14px] md:text-[18px] lg:text-[20px] font-[600] text-center text-black">
            ₹{product.price.toFixed(2)}
          </div>
        )}

        <div className="lg:text-[16px] text-[12px] text-black lg:mb-[10px] md:mb-[10px] mb-[5px]">
         Weight: {product.unit }
        </div>

    {/* CTA row: fixed row height to stop card stretching */}
    <div className="flex items-center justify-center h-[24px] md:h-[32px] lg:h-[43px]">
      {qty > 0 ? (
 <div className="flex items-center justify-center h-[24px] md:h-[32px] lg:h-[43px]">
  <div className="inline-flex items-stretch rounded-md overflow-hidden shadow-sm">
    <button
      className="h-[23px] md:h-[30px] lg:h-[43px] w-[25px] md:w-[30px] lg:w-[40px] pl-1
                  bg-[#0C5273] text-white font-[600]
                 rounded-none"
      style={{ borderRightWidth: 0 }}
      onClick={() => decreaseQty(product.id, idToken)}
    >
      <FiMinus />
    </button>

    <input
      type="text"
      readOnly
      value={qty}
      className="h-[23px] md:h-[30px] lg:h-[43px] w-[35px] md:w-[130px] lg:w-[100px]
                 text-[12px] md:text-[14px] lg:text-[18px] text-center
                 bg-[#0C5273] text-white font-[500] 
                 rounded-none"
      style={{ borderLeftWidth: 0, borderRightWidth: 0 }}
    />

    <button
      className="h-[23px] md:h-[30px] lg:h-[43px] w-[25px] md:w-[30px] lg:w-[40px]
                 bg-[#0C5273] text-white font-[600]
                 rounded-none"
      style={{ borderLeftWidth: 0 }}
      onClick={(e) => {
        triggerSpark(e, '#ffffff');
        increaseQty(product.id, idToken);
        triggerCartDrawer({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          unit: product.unit || product.weight || '200 gm',
          price: product.price,
        });
      }}
    >
      <FiPlus />
    </button>
  </div>
</div>

      ) : (
        <button
          style={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0 -100%',
            transition: 'background-position 1s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = '150% 100%')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = '0 -100%')}
          className="h-full w-[85px] md:w-[190px] lg:w-[180px]
                     border border-[#0C5273] md:border-[2px] lg:border-[2px]
                     text-[#0C5273] text-[11px] md:text-[14px] lg:text-[16px] font-[500] rounded-[3px]
                     lg:hover:text-white"
          onClick={(e) => {
            triggerSpark(e, '#ffffff');
            increaseQty(product.id, idToken);
            triggerCartDrawer({
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              unit: product.unit || product.weight || '200 gm',
              price: product.price,
            });
          }}
        >
          Add to cart
        </button>
      )}
    </div>
  </div>
</div>

            );
          })}
        </div>
      )}
    </section>
  );
};

export default BestsellingCombos;