import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import SuggestionCard from "../../components/SuggestionCard/SuggestionCard";
import { FiMinus, FiPlus } from "react-icons/fi";
import { assets } from "../../assets/assets";
import { ChevronRight, X } from "lucide-react";
import CouponModal from "../../components/CouponModal/CouponModal";
import { FaTrash } from "react-icons/fa";
import LocationFlow from "../Location/LocationFlow";
import axios from "axios";
import { charges } from '../../service/chargeService';
import Login from "../Login/Login";
import { useAddresses } from "../../context/AddressContext";
import { useAuth } from "../../context/AuthContext";
import { fetchFoodList } from "../../service/foodService";
import { CartContext } from "../../context/CartContext";
import PriceDetails from "./PriceDetails";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.config";
const API_BASE =  import.meta.env.VITE_API_URL;

const Cart2Drawer = ({ onClose }) => {
  const {
    quantites,
    increaseQty,
    decreaseQty,
    removeFromCart,
    deliveryCharge,
    handlingCharge,
    gstPercentage,
    appliedCoupon,
    setAppliedCoupon,
    handleRemoveCoupon,
    suggestions,
    cartItems,
    itemTotal,
    couponDiscount,
    subtotal,
    gst,
    grandTotal,
    actualCouponDiscount
  } = useContext(CartContext);
  
  // Calculate actual item total (with product discounts already applied)
  const actualItemTotal = cartItems.reduce((acc, item) => {
    const price = item.discountedPrice > 0 && item.discountedPrice < item.price 
      ? item.discountedPrice 
      : item.price;
    return acc + (price * item.quantity);
  }, 0);
  const {  selectedAddress, selectAddress } = useAddresses();
  const { idToken } = useAuth();

  const navigate = useNavigate();

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showLocationFlow, setShowLocationFlow] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const totalCount = Object.values(quantites).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);

  // Open drawer with a slight delay for animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsCartOpen(true), 2);
    return () => clearTimeout(timeout);
  }, []);

  // Lock/Unlock body scroll when drawer opens/closes
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);


  const handleCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // When LocationFlow saves/changes address
  const handleAddressChange = (address) => {
    selectAddress(address);
    setShowLocationFlow(false);
  };

  const handlePlaceOrder = async () => {
  try {
    // Build items array from cartItems
    const items = cartItems.map((item, idx) => {
      const unitPrice =
        item.discountedPrice > 0 && item.discountedPrice < item.price
          ? item.discountedPrice
          : item.price;

      return {
        item_id: String(item.id),
        item_name: item.name,
        item_brand: item.brand || "LetsTryFoods",
        item_category: item.category || "Snacks",
        item_variant: item.unit || item.weight || undefined,
        price: Number(Number(unitPrice).toFixed(2)),
        quantity: Number(item.quantity || quantites[item.id] || 1),
        index: idx,
      };
    });

    // // Compute value as sum(price * quantity)
    // const value = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

    // Fire GA4 begin_checkout
    if (analytics && items.length > 0) {
      logEvent(analytics, "begin_checkout", {
        currency: "INR",
        value: grandTotal,
        coupon: appliedCoupon?.code || undefined,
        items,
      });
    }

    // Proceed with your UI transition
    setIsCartOpen(false);
    setTimeout(() => {
      onClose();
      navigate("/order", {
        state: {
          total: grandTotal,
          promoCode: appliedCoupon?.code || "",
        },
      });
    }, 300);
  } catch (error) {
    console.error("Error", error);
  }
};

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/40 z-40"
        onClick={handleCloseCart}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-[45px] pb-[100px] lg:pb-0 md:pb-0 sm:pb-0 right-0 h-[calc(100vh-45px)] w-full sm:w-[400px] bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 rounded-t-3xl lg:rounded-none md:rounded-none sm:rounded-none overflow-hidden ${ isCartOpen ? "translate-x-0" : "translate-x-full" }`} >
        {/* Header */}
        <div className="px-4 py-2 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-[16px] font-[500]">
            <AiOutlineShoppingCart size={34} />
            Cart items ({totalCount} item{totalCount !== 1 ? "s" : ""})
          </div>
          {appliedCoupon && (
            <div className="border border-[#2A6C283B] bg-[#D2FFD2] text-[#2A6C28] lg:text-[12px] text-[10px] font-[700] p-2 rounded-[40px] ">
              Saved ₹{couponDiscount.toFixed(2)}
            </div>
          )}
          <button onClick={handleCloseCart}>
            <X className="text-black" />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto px-4 mb-3 hide-scrollbar"
          style={{ minHeight: 0 }}
        >
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 mt-3 pb-0">
              <img
                src={item.imageUrl}
                className="w-[110px] h-[110px] object-contain border rounded p-2"
                alt={item.name}
              />
              <div className="flex-1">
                <div className="text-black text-[14px] font-semibold line-clamp-1">
                  {item.name}
                </div>
                <div className="text-black text-[14px] font-[400]">
                  Size: {item.unit}
                </div>
                {item.discountedPrice > 0 && item.discountedPrice < item.price ? (
                  <>
                    {item.discountPercent > 0 && (
                      <div className="text-[#3149A6] text-[12px] font-[500]">
                        {item.discountPercent}% off
                      </div>
                    )}
                    <div className="flex flex-row gap-3">
                      <div className="text-black text-[14px] font-semibold">
                        ₹{item.discountedPrice.toFixed(2)}
                      </div>
                      <div className="text-[14px] line-through text-[#00000091] font-[400]">
                        ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-black text-[14px] font-semibold mb-3">
                    ₹{item.price.toFixed(2)}
                  </div>
                )}
                <div className="flex items-center">
                  <button
                    className="w-8 h-7 text-[12px] px-2 border-2 border-[#0C5273] bg-[#0C527326] text-[#0C5273] font-[600] rounded-l"
                    onClick={() => decreaseQty(item.id, idToken)}
                  >
                    <FiMinus />
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={item.quantity || 0}
                    className="w-8 h-7 text-[15px] rounded-0 text-center border-y-2 border-[#0C5273] text-black font-[500]"
                  />
                  <button
                    className="w-8 h-7 text-[12px] px-2 border-2 border-[#0C5273] bg-[#0C527326] text-[#0C5273] font- rounded-r"
                    onClick={() => increaseQty(item.id, idToken)}
                  >
                    <FiPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id, idToken)}
                    className="ml-2 text-[12px] underline text-[#000000A1]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {appliedCoupon ? (
            <div className="bg-[#E9F5E9] border-l-[3px] border-[#2A6C28] px-2.5 py-3 rounded-r my-3 flex items-center gap-3">
              <img src={assets.marketing} loading="lazy" className="h-[20px] w-[20px]" />
              <div className="flex flex-row gap-10">
                <div className="flex flex-col leading-tight-[1.1]">
                  <p className="text-[14px] font-[700] text-[#2A6C28] mb-1 pb-0">
                    Coupon Applied: <span>{appliedCoupon.code}</span>
                  </p>
                  <p className="text-[12px] text-[#6A6868F0] font-[500] m-0">
                    Promo code applied successfully.
                  </p>
                </div>
                <div className="flex flex-col leading-tight-[1.1] items-center">
                  <p className="text-[12px] font-[700] text-[#000000C7] mb-2">
                    - ₹{couponDiscount.toFixed(2)}
                  </p>
                  <button onClick={handleRemoveCoupon}>
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setShowCouponModal(true)}
              className="my-3 bg-[#FFFAC5] py-2 w-full rounded-[10px] h-[46px] cursor-pointer"
            >
              <img
                src={assets.coupon}
                className="h-[20px] w-[20px] ml-4 inline-block"
              />
              <p className="text-[16px] ml-3 font-[600] inline-block">
                View coupons
              </p>
              <ChevronRight className="inline-block ml-[150px] text-black h-[20px] w-[20px]" />
            </div>
          )}

          <div className="flex flex-col gap-4 w-full mb-20">
            <div className="bg-white pb-3 mb-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-black text-[16px] font-[500]">More suggestions</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {suggestions.map((item) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => increaseQty(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 w-full bg-white border-t pb-3 pt-1 z-10">
          <div className="border-b px-4 py-2">
            <div className="flex items-center gap-1">
              <img src={assets.home} alt="home icon" loading="lazy" className="h-5 w-5" />
              <span className="text-[14px] font-[500] text-black">
                Delivering to{" "}
                <span className="ml-1 text-black truncate">
                  {selectedAddress && selectedAddress.buildingName
                    ? [selectedAddress.buildingName, selectedAddress.street, selectedAddress.city, selectedAddress.pincode]
                        .filter(Boolean)
                        .join(', ')
                    : "Select Address"}
                </span>
              </span>
              {selectedAddress ? (
                <button
                  onClick={() => setShowLocationFlow(true)}
                  className="ml-3 text-[13px] font-[600] text-[#0C5273] underline"
                >
                  Change
                </button>
              ) : (
                " "
              )}
            </div>
          </div>

          <div className="flex justify-between items-center h-[35px] mt-3 px-4 ">
            <div className="text-[#0C5273] font-[700] text-[17px] text-center">
              ₹ {grandTotal.toFixed(2)}
              <br />
              <Button
                onClick={() => setShowPriceDetails(true)}
                style={{
                  backgroundColor: "white",
                  color: "white",
                  fontWeight: 600,
                  border: "none",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="underline text-[#0C5273] font-[700] text-[12px] text-center">
                  View price details
                </span>
              </Button>
            </div>
            {idToken ? (
              selectedAddress ? (
                <button
                  className={`w-[200px] text-white text-[17px] font-semibold rounded-[5px] py-1 ${
                    cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0C5273]"
                  }`}
                  disabled={cartItems.length === 0}
                  onClick={handlePlaceOrder}
                >
                  Place order
                </button>
              ) : (
                <button
                  className={`w-[200px] bg-[#0C5273] text-white text-[17px] font-semibold rounded-[5px] py-1 ${
                    cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                  disabled={cartItems.length === 0}
                  onClick={() => setShowLocationFlow(true)}
                >
                  Select Address
                </button>
              )
            ) : (
              <button
                className="w-[200px] bg-[#0C5273] text-white text-[17px] font-semibold rounded-[5px] py-1"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Price Details Overlay */}
      {showPriceDetails && (
        <PriceDetails
          itemTotal={itemTotal}
          couponDiscount={couponDiscount}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          handlingCharge={handlingCharge}
          gst={gst}
          gstPercentage={gstPercentage}
          grandTotal={grandTotal}
          youSave={couponDiscount}
          onClose={() => setShowPriceDetails(false)}
          actualCouponDiscount={actualCouponDiscount}
        />
      )}

      {/* Modals */}
      {showLocationFlow && (
        <LocationFlow
          visible={showLocationFlow}
          onClose={() => setShowLocationFlow(false)}
          onSave={handleAddressChange}
        />
      )}

      {showCouponModal && (
        <CouponModal
          onClose={() => setShowCouponModal(false)}
          itemTotal={actualItemTotal}
          setAppliedCoupon={setAppliedCoupon}
        />
      )}

      {!idToken && showLoginModal && <Login onCancel={() => setShowLoginModal(false)} />}
    </>
  );
};

export default Cart2Drawer;
