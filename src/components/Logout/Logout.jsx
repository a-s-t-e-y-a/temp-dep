import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const Logout = ({ onCancel }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("address");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("_grecaptcha");
    navigate("/", { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{ background: "rgba(0, 0, 0, 0.4)" }}
    >
      <div className="bg-white lg:w-[90%] w-[70%] max-w-[420px] rounded-[16px] p-6 text-center shadow-lg">
        <h2 className="font-bold lg:text-[28px] text-[20px] mb-2 leading-tight">
          Are you sure you want to log out?
        </h2>
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="relative">
            <img
              src={assets.emptycart}
              alt="Cart"
              className="lg:w-[56px] lg:h-[56px] w-[60px] h-[40px]"
            />
          </div>
          <span className="lg:text-[18px] text-[15px] text-black text-left">
            If you log out, all items in your cart will be lost!
          </span>
        </div>
        <div className="flex justify-center lg:gap-4 gap-2 mt-8">
          <button
            onClick={onCancel}
            className="bg-[#17607D] text-white font-semibold lg:px-6 lg:py-2 px-3 py-1 rounded-[10px] lg:text-[16px] text-[13px]"
          >
            Stay logged in
          </button>
          <button
            onClick={handleConfirm}
            className="border-2 border-[#17607D] text-[#17607D] font-semibold lg:px-6 lg:py-2 px-3 py-1 rounded-[10px] lg:text-[16px] text-[13px] bg-white"
          >
            Logout Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
