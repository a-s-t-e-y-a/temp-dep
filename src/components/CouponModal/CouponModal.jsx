// CouponModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
const API_BASE = import.meta.env.VITE_API_URL;
const CouponModal = ({ onClose, itemTotal, setAppliedCoupon }) => {
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCouponLocal] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

  const ANDROID_APP_URL =
    "https://play.google.com/store/apps/details?id=com.letstryapp";

  const IOS_APP_URL = "https://apps.apple.com/in/app/lets-try/id6749929023";

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/promocode/active`);
        const data = await res.json();
        const activeCoupons = data.filter((coupon) => coupon.active);
        setCoupons(activeCoupons);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    };
    fetchCoupons();

    // Load applied coupon from localStorage if exists
    // const stored = localStorage.getItem('appliedCoupon');
    // if (stored) {
    //   const parsed = JSON.parse(stored);
    //   setAppliedCouponLocal(parsed);
    //   setAppliedCoupon(parsed);
    // }
  }, []);

  // Auto-remove applied coupon if cart total drops below minimum
  useEffect(() => {
    if (appliedCoupon && itemTotal < appliedCoupon.minOrderValue) {
      toast.info(
        `Coupon ${appliedCoupon.code} removed: minimum order ₹${appliedCoupon.minOrderValue} not met.`
      );
      setAppliedCouponLocal(null);
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
    }
  }, [itemTotal]);

  const handleApply = (coupon) => {
    if (itemTotal < coupon.minOrderValue) {
      toast.error(
        `Minimum order value for this coupon is ₹${coupon.minOrderValue}`
      );
      return;
    }
    setAppliedCouponLocal(coupon);
    setAppliedCoupon(coupon);
    localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
    toast.success(`Coupon ${coupon.code} applied!`, { autoClose: 1000 });
  };

  const handleRemove = () => {
    setAppliedCouponLocal(null);
    setAppliedCoupon(null);
    localStorage.removeItem("appliedCoupon");
    toast.info(`Coupon removed.`, { autoClose: 1000 });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  const handleManualApply = () => {
    const matchedCoupon = coupons.find(
      (c) => c.code.toLowerCase() === enteredCode.toLowerCase()
    );
    if (matchedCoupon) {
      if (itemTotal < matchedCoupon.minOrderValue) {
        toast.error(
          `Minimum order value for this coupon is ₹${matchedCoupon.minOrderValue}`,
          { autoClose: 1000 }
        );
        return;
      }
      handleApply(matchedCoupon);
    } else {
      toast.error("Invalid coupon code", {
        autoClose: 1000,
      });
    }
  };

  const redirectToAppStore = () => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      window.open(ANDROID_APP_URL, '_blank');
      return;
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.open(IOS_APP_URL, '_blank');
      return;
    }

    // Desktop / Laptop fallback - open Android Play Store
    window.open(ANDROID_APP_URL, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white lg:w-[30%] w-[80%] sm:w-[500px]  rounded-xl shadow-lg relative">
        {/* Sticky Heading */}
        <div className="sticky top-0 bg-white z-10 pt-3 rounded-t-xl pb-3 px-4 border-b border-gray-200 shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-600 lg:hover:text-black"
          >
            <X className="w-4 h-4 md:w-6 md:h-6 lg:w-6 lg:h-6" />
          </button>
          <h2 className="text-[16px] lg:text-[20px] md:text-[20px] font-bold text-center text-black">
            Coupon & Offers
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 pt-3 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto  hide-scrollbar">
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              className="border w-full px-3 py-2 bg-[#F2F1F1] rounded-lg pr-20 text-[12px] md:text-[15px] lg:text-[15px]"
            />
            <button
              onClick={handleManualApply}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00000075] px-3 py-1 rounded-md text-[12px] md:text-[15px] lg:text-[15px] font-[700]"
            >
              APPLY
            </button>
          </div>

          <button 
            onClick={redirectToAppStore} 
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white font-bold py-3 px-4 rounded-lg mb-4 text-[13px] md:text-[15px] lg:text-[15px] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            
            Get Extra Discount and offer – Download App
          </button>

          <h3 className="text-[14px] lg:text-[18px] md:text-[18px] font-[700] text-black mb-3">
            More offers
          </h3>

          <div className="flex flex-col gap-3">
            {coupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              const isEligible = itemTotal >= coupon.minOrderValue;
              const balanceAmount = coupon.minOrderValue - itemTotal;

              return (
                <div
                  key={coupon.id}
                  className={`border-y-[3px] border-r-[3px] rounded-[15px] px-4 py-1 leading-tight ${
                    isApplied
                      ? "bg-[#DBFFD7] border-[#36B328] border-l-[20px]"
                      : isEligible
                      ? "bg-[#FFF7E8] border-[#FDE194] border-l-[10px]"
                      : "bg-gray-200 border-gray-400 border-l-[10px] opacity-60 cursor-not-allowed"
                  }`}
                >
                  <p className="text-[12px] lg:text-[14px] md:text-[14px] font-[400] text-black mb-0.5">
                    {coupon.description}
                  </p>

                  <div className="flex items-center justify-between mb-0.5">
                    <span className="bg-white border-2 px-2 py-1 font-[700] text-[12px] lg:text-[14px] md:text-[14px] text-[#0C5273] border-[#0C5273] border-dashed rounded-[5px]">
                      {coupon.code}
                    </span>

                    {isApplied ? (
                      <div className="flex flex-col items-center lg:gap-3 gap-1">
                        <span className="bg-[#36B328] text-white px-3 py-1 rounded text-[12px] lg:text-[14px] md:text-[14px]">
                          APPLIED
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => isEligible && handleApply(coupon)}
                        disabled={!isEligible}
                        className={`px-3 py-1 rounded text-[12px] lg:text-[14px] md:text-[14px] ${
                          isEligible
                            ? "bg-[#0C5273] text-white"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      >
                        APPLY
                      </button>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-between lg:gap-3 gap-1">
                    <div className="flex flex-col ">
                      <div className="text-[12px] lg:text-[14px] md:text-[14px] font-[400] text-black mb-0.5">
                        Min order value: ₹{coupon.minOrderValue}
                      </div>
                      <div className="text-[12px] lg:text-[14px] md:text-[14px] font-[400] text-black mb-0.5">
                        Valid till: {formatDate(coupon.expiryDate)}
                      </div>
                    </div>
                    {isApplied && (
                      <div className="pr-8">
                        <button onClick={handleRemove}>
                          <FaTrash />
                        </button>{" "}
                      </div>
                    )}
                  </div>
                  {!isEligible && !isApplied && (
                    <p className="text-[10px] lg:text-[12px] md:text-[12px] text-red-600 font-[500]">
                      Add items worth more ₹{balanceAmount} to apply this
                      coupon.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
