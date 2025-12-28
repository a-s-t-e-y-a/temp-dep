import React, { useEffect, useRef, useState } from "react";
import { FaTag, FaBoxOpen, FaTruck, FaHandHoldingUsd, FaInfoCircle } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";

const PriceDetails = ({
  itemTotal,
  couponDiscount,
  subtotal,
  deliveryCharge,
  handlingCharge,
  gst,
  gstPercentage,
  grandTotal,
  youSave,
  onClose,
  actualCouponDiscount,
}) => {
  const [showTaxesInfo, setShowTaxesInfo] = useState(false);
  const taxesRef = useRef(null);

  // Optional: close the box when clicking outside
  useEffect(() => {
    if (!showTaxesInfo) return;
    const onDocClick = (e) => {
      if (!taxesRef.current) return;
      if (!taxesRef.current.contains(e.target)) setShowTaxesInfo(false);
    };
    document.addEventListener("pointerdown", onDocClick);
    return () => document.removeEventListener("pointerdown", onDocClick);
  }, [showTaxesInfo]);

  return (
    <div
      className="fixed top-[45px] right-0 h-[calc(100vh-45px)] w-full sm:w-[400px] bg-white z-50 shadow-xl flex flex-col p-6 overflow-y-auto transition-transform duration-300"
      style={{ maxWidth: 400 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Price Details</h2>
        <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-black" aria-label="Close">
          &times;
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><FaBoxOpen /> Items total</span>
          <span>₹{itemTotal.toFixed(2)}</span>
        </div>

      {couponDiscount > 0 && (
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-blue-600">
          {<FaTag />}
          {actualCouponDiscount > 0 ? "Coupon Discount" : "Savings"}
        </span>
        <span className="text-blue-600">-₹{couponDiscount.toFixed(2)}</span>
      </div>
      )}

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <IoReceiptOutline className="text-gray-900" aria-hidden="true" />
            <span>Subtotal</span>
          </span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><FaTruck /> Delivery Charge</span>
          <span>
            {deliveryCharge === 0 ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              `₹${deliveryCharge.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><FaHandHoldingUsd /> Handling Charge</span>
          <span>₹{handlingCharge.toFixed(2)}</span>
        </div>
      </div>

      {/* Taxes & Charges header with info button */}
      <div className="mt-6 mb-2" ref={taxesRef}>
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <span>Taxes & Charges</span>
          <button
            type="button"
            aria-expanded={showTaxesInfo}
            aria-controls="taxes-info-panel"
            onClick={() => setShowTaxesInfo((v) => !v)}
            className="inline-flex items-center justify-center rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Show details"
          >
            <FaInfoCircle className={showTaxesInfo ? "text-blue-600" : ""} />
          </button>
        </div>

        {/* Collapsible details panel */}
        <div
          id="taxes-info-panel"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ${showTaxesInfo ? "opacity-100" : "opacity-0"}`}
          style={{ maxHeight: showTaxesInfo ? 200 : 0 }}
        >
          <div className="flex justify-between items-center bg-blue-50 rounded px-2 py-1 w-fit text-[13px]">
            <span>GST on Delivery &amp; Handling charge ({gstPercentage}%)</span>
            <span> ₹{gst.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
        {youSave > 0 && (
          <div className="mt-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
              You Save ₹{youSave.toFixed(2)}
            </span>
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">Including taxes &amp; charges</div>
      </div>
    </div>
  );
};

export default PriceDetails;
