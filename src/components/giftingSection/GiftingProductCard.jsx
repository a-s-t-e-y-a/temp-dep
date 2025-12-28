import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import bg from "../../assets/bg.png"; // for the animated "Add to cart" button

const currency = (v) => {
  if (v == null) return "₹0.00";
  const n = Number(v);
  if (Number.isNaN(n)) return "₹0.00";
  return `₹${n.toFixed(2)}`;
};

const GiftingProductCard = ({ product }) => {
  const {
    id,
    name,
    title,
    imageUrl,
    image,
    unit,
    weight,
    size,
    price,
    discountedPrice,
  } = product || {};

  const displayTitle = name || title || "Gift";
  const displayImg = imageUrl || image;
  const displayUnit = unit || weight || size || "";
  const displayPrice =
    discountedPrice && Number(discountedPrice) > 0 ? discountedPrice : price;

  // Cart + auth
  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } = useContext(CartContext);
  const { idToken } = useAuth();

  // Fallback id if your gifting payload uses other keys (sku/_id)
  const productId = useMemo(() => id || product?.sku || product?._id, [id, product]);

  const effectivePrice = Number(displayPrice) || 0;
  const qty = productId ? Number(quantites?.[productId] || 0) : 0;

  const handleAdd = () => {
    if (!productId) return;
    increaseQty(productId, idToken);
    triggerCartDrawer({
      id: productId,
      name: displayTitle,
      imageUrl: displayImg,
      unit: displayUnit,
      price: effectivePrice,
    });
  };

  const handleRemove = () => {
    if (!productId) return;
    decreaseQty(productId, idToken);
  };

  return (
    <div className="w-full bg-[#FAF5EB] rounded-xl shadow-md border border-[#E8D9B8] overflow-hidden">
      {/* Image: shorter on mobile, 4:3 from sm+ */}
      <div className="w-full aspect-[3/2] sm:aspect-[4/3] bg-white">
        {displayImg ? (
          <img
            src={displayImg}
            alt={displayTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9A9A9A]">
            No image
          </div>
        )}
      </div>

      {/* Content: compact base, scales up progressively */}
      <div className="px-3 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-4">
      <div className="text-[12px] sm:text-[15px] md:text-[16px] font-[700] leading-snug line-clamp-2 min-h-[34px] sm:min-h-[42px] md:min-h-[46px]">
        {displayTitle}
      </div>

        <div className="text-[11px] sm:text-[12px] md:text-[12px] text-[#6B6B6B] mt-1 leading-tight">
          {displayUnit || "—"}
        </div>

        <div className="text-[11px] sm:text-[14px] md:text-[15px] text-black font-[700] mt-2 leading-tight">
          {currency(effectivePrice)}
        </div>

        {/* Add / Qty controls (same pattern as ProductCard) */}
        {qty > 0 ? (
          <div className="flex items-center mt-3 mb-1">
            <button
              className="w-[20px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[40px] h-7 lg:h-10 text-[12px] lg:text-[18px] border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-l-md"
              onClick={handleRemove}
            >
              −
            </button>
            <input
              type="text"
              readOnly
              value={qty}
              className="w-[40px] md:h-7 md:w-[116px] lg:w-[140px] h-7 lg:h-10 text-[12px] lg:text-[18px] rounded-[0px] text-center border-y-2 border-[#0C5273] text-white bg-[#0C5273] font-[500]"
            />
            <button
              className="w-[25px] md:h-7 md:w-[32px] md:pl-2 pl-1 md:text-[16px] lg:w-[60px] h-7 lg:h-10 text-[12px] lg:text-[18px] border-2 border-[#0C5273] text-white bg-[#0C5273] font-[600] rounded-r-md"
              onClick={handleAdd}
            >
              +
            </button>
          </div>
        ) : (
  <button
    type="button"
    onClick={handleAdd}
    className="mt-3 w-full bg-[#0C5273] hover:opacity-95 text-white text-[11px] sm:text-[13px] md:text-[13px] font-[600] py-1.5 md:py-2.5 rounded-md mb-1"
  >
    Add to cart
  </button>
        )}
      </div>
    </div>
  );
};

GiftingProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default GiftingProductCard;
