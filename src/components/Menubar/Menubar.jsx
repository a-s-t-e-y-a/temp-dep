import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { GoChevronDown } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import LocationFlow from "../Location/LocationFlow";
import Login from "../Login/Login";
import { X } from "lucide-react";
import { useAddresses } from "../../context/AddressContext";
import { analytics } from "../../firebase.config";
import { logEvent } from "firebase/analytics";

const Menubar = () => {
  const { quantites, setQuantites, setToken, setShowCart } =
    useContext(CartContext);
  const { idToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLocationFlow, setShowLocationFlow] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const totalCount = Object.values(quantites).reduce(
    (sum, qty) => sum + (qty > 0 ? qty : 0),
    0
  );
  const { selectedAddress, selectAddress } = useAddresses();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantites({});
    setSearchTerm("");
    navigate("/");
  };

  const handleLogin = (receivedToken) => {
    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setShowLoginModal(false);
  };

  const handleAddressChange = (address) => {
    selectAddress(address);
    setShowLocationFlow(false);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  }, [searchTerm]);

  useEffect(() => {
    const urlSearchParam = new URLSearchParams(location.search).get("q") || "";
    setSearchTerm(urlSearchParam);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-white hidden lg:block md:block py-1 w-full border-b h-[70px] relative z-50">
        <div className="flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img
                src={assets.logo}
                alt="Logo"
                className="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] md:w-[30px] md:h-[30px] object-contain"
              />
            </Link>
            <button
              onClick={() => {
                if (idToken) {
                  setShowLocationFlow(true);
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="text-black font-medium lg:text-[17px] text-[16px] md:text-[13px] focus:outline-none text-left max-w-[80px] md:max-w-[140px] lg:max-w-[180px] truncate flex flex-col justify-center leading-tight"
            >
              {selectedAddress ? (
                <>
                  <span className="font-bold">Delivering at</span>
                  {selectedAddress.buildingName && (
                    <span className="truncate">
                      {selectedAddress.buildingName} {selectedAddress.street}{" "}
                      {selectedAddress.city}, {selectedAddress.pincode}{" "}
                      <span className="font-bold text-[15px] inline-block align-middle">
                        <GoChevronDown />
                      </span>
                    </span>
                  )}
                </>
              ) : (
                <span className="flex items-center gap-1 justify-center h-full">
                  Select location
                  <span className="font-bold text-[15px] pt-1 inline-block align-middle">
                    <GoChevronDown />
                  </span>
                </span>
              )}
            </button>
          </div>

          <ul
            ref={menuRef}
            className={`lg:flex md:flex lg:gap-10 md:gap-4 text-lg pt-3 lg:static lg:bg-transparent`}
          >
            <li>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] md:text-[16px] lg:text-[20px] pb-1 transition-colors duration-200 no-underline ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/combo"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] md:text-[16px] lg:text-[20px] pb-1 transition-colors duration-200 no-underline ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                Combos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] md:text-[16px] lg:text-[20px] pb-1 transition-colors duration-200 no-underline ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                About us
              </NavLink>
            </li>
            {!idToken && (
              <li>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMenuOpen(false);
                  }}
                  className="relative text-[18px] md:text-[16px] lg:text-[20px] pb-1 transition-colors duration-200 no-underline text-black font-[500] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black lg:hover:after:w-full after:transition-all after:duration-300"
                >
                  Login
                </button>
              </li>
            )}
          </ul>

          <div className="hidden md:flex lg:flex items-center md:gap-2 lg:gap-4">
            <div className="relative">
              <input
                id="desktopSearch"
                name="search"
                type="text"
                placeholder="Search for products"
                className="rounded-full md:text-[12px] md:px-2 lg:pl-4 lg:pr-10 lg:w-[190px] md:w-[150px] py-2 border border-[#0714376B] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#0C5273] focus:bg-white lg:hover:bg-[#0C527326]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (!window.location.pathname.includes("/search")) {
                    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                  }
                }}
              />
              <img
                src={assets.search}
                alt="search"
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2"
              />
            </div>
            {totalCount > 0 && (
              <button
                onClick={() => {
                  setShowCart(true);
                  logEvent(analytics, "view_cart");
                }}
                className="relative"
              >
                <img
                  src={assets.cart}
                  alt="cart"
                  className="max-w-full md:mt-1 lg:h-7 md:h-5 h-7"
                />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-1.5">
                  {totalCount}
                </span>
              </button>
            )}
            <div className="relative group">
              <button
                onClick={() => {
                  if (idToken) {
                    navigate("/account");
                  } else {
                    setShowLoginModal(true);
                  }
                }}
              >
                <img
                  src={assets.profile}
                  alt="profile"
                  className="max-w-full lg:h-8 md:h-7 h-8 rounded-full cursor-pointer pt-2"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white block lg:hidden md:hidden h-[55px] py-1 w-full relative z-10">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => {
              if (idToken) {
                setShowLocationFlow(true);
              } else {
                setShowLoginModal(true);
              }
            }}
            className="text-black font-[500] text-[9px] focus:outline-none text-left max-w-[120px] truncate leading-tight flex flex-col justify-center"
          >
            {selectedAddress ? (
              <>
                <span className="font-bold">Delivering at</span>
                {selectedAddress.buildingName && (
                  <span className="truncate pt-[3px]">
                    {selectedAddress.buildingName}, {selectedAddress.street},{" "}
                    {selectedAddress.city}, {selectedAddress.pincode}{" "}
                  </span>
                )}
              </>
            ) : (
              <span className="flex text-[12px] font-[500] items-center gap-[2px] justify-center">
                Select location
                <span className="font-bold text-[14px] inline-block align-middle">
                  <GoChevronDown />
                </span>
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <img
              src={assets.search}
              alt="search"
              className="h-[22px] cursor-pointer"
              onClick={() => navigate("/search")}
            />

            {totalCount > 0 && (
              <button
                onClick={() => {
                  setShowCart(true);
                  logEvent(analytics, "view_cart");
                }}
                className="relative"
              >
                <img
                  src={assets.cart}
                  alt="cart"
                  className="max-w-full md:mt-1 lg:h-7 md:h-5 h-7"
                />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-1.5">
                  {totalCount}
                </span>
              </button>
            )}

            <div className="text-[24px] my-[11px]">
              <RxHamburgerMenu onClick={() => setMenuOpen(true)} />
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link to="/">
            <img
              src={assets.logo}
              alt="logo"
              loading="lazy"
              className="h-[40px] max-w-full"
            />
          </Link>
        </div>
      </div>

      <div
        className={`fixed top-8 right-0 w-full h-full bg-white z-[999999999] pl-4 pr-3 pt-3 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-start">
          <img
            src={assets.logo}
            alt="logo"
            loading="lazy"
            className="h-[56px]"
          />
          <button onClick={() => setMenuOpen(false)} className="text-[24px]">
            <X className="text-black" />
          </button>
        </div>

        <div className="mt-6 space-y-6 font-semibold text-[17px]">
          <ul ref={menuRef} className="text-[14px] mx-0 space-y-3 px-0 pt-3">
            <li>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] mb-3 transition-colors duration-200 no-underline 
                  ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } 
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black 
                  lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/combo"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] mb-3 transition-colors duration-200 no-underline 
                  ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } 
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black 
                  lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                Combos
              </NavLink>
            </li>

            {totalCount > 0 && (
              <li>
                <button
                  onClick={() => {
                    setShowCart(true);
                    setMenuOpen(false);
                    logEvent(analytics, "view_cart");
                  }}
                  className="relative text-[18px] transition-colors duration-200 no-underline text-black font-[500]
                    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black 
                    lg:hover:after:w-full after:transition-all after:duration-300 lg:hover:text-[#0C5273] lg:hover:font-[700]"
                >
                  Cart
                </button>
              </li>
            )}
            <li>
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative text-[18px] mb-3 transition-colors duration-200 no-underline 
                  ${
                    isActive
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  } 
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black 
                  lg:hover:after:w-full after:transition-all after:duration-300`
                }
              >
                About us
              </NavLink>
            </li>
            <li>
              <NavLink
                to={idToken ? "/account" : "#"}
                onClick={() => {
                  if (!idToken) {
                    setShowLoginModal(true);
                  }
                  setMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `relative text-[18px] md:text-[16px] lg:text-[20px] pb-1 transition-colors duration-200 no-underline
                  ${
                    isActive && idToken
                      ? "text-[#0C5273] font-[700]"
                      : "text-black font-[500]"
                  }
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black lg:hover:after:w-full after:transition-all after:duration-300`
                }
                style={{ cursor: idToken ? "pointer" : "default" }}
              >
                Account
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {showLocationFlow && (
        <LocationFlow
          visible={showLocationFlow}
          onClose={() => setShowLocationFlow(false)}
          onSave={handleAddressChange}
        />
      )}

      {!idToken && showLoginModal && (
        <Login
          onCancel={() => setShowLoginModal(false)}
          onConfirm={handleLogin}
        />
      )}
    </>
  );
};

export default Menubar;
