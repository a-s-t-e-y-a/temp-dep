// Footer.jsx
import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { BiPlus, BiMinus } from 'react-icons/bi';

const Footer = () => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleEmailClick = (email) => (window.location.href = `mailto:${email}`);
  const handleSocialClick = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <>
      {/* Desktop / Tablet */}
      <footer
        className="
          hidden md:block lg:block
          bg-[#1E2541] text-white w-full
          pt-16 pb-12 px-4 md:px-20
          mb-0
          overflow-hidden          /* clip children so no bleed at edges */
        "
      >
        <div
          className="
            max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-8
            [&_*]:m-0                 /* zero default margins inside */
          "
        >
          {/* Column A */}
          <div className="flex flex-col items-start">
            <img src={assets.logo} alt="Logo" loading="lazy" className="h-20 w-20 object-contain mb-4 block" /> {/* block avoids baseline gap */}

            <div className="mt-6 px-2">
              <p className="font-semibold text-base mb-3">Follow us</p>
              <div className="flex gap-3">
                <img
                  src={assets.facebook}
                  alt="Facebook"
                  className="h-[36px] w-[36px] cursor-pointer block"
                  onClick={() =>
                    handleSocialClick('https://www.facebook.com/people/Lets-Try/100067844378739/')
                  }
                />
                <img
                  src={assets.instagram}
                  alt="Instagram"
                  className="h-[36px] w-[36px] cursor-pointer block"
                  onClick={() => handleSocialClick('https://www.instagram.com/letstry_foods/')}
                />
              </div>
            </div>
          </div>

          {/* Column B - QUICK LINKS */}
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-xl pt-2">QUICK LINKS</h3>
            <ul className="space-y-3 list-none pl-0 text-lg">
              <li className="last:mb-0">
                <button
                  onClick={() => {
                    navigate('/search');
                    window.scrollTo(0, 0);
                  }}
                  className="lg:hover:underline"
                >
                  Search
                </button>
              </li>
              <li className="last:mb-0">
                <button
                  onClick={() => {
                    navigate('/refund-policy');
                    window.scrollTo(0, 0);
                  }}
                  className="lg:hover:underline"
                >
                  Refund & Cancellations
                </button>
              </li>
              <li className="last:mb-0">
                <button
                  onClick={() => {
                    navigate('/shipping-policy');
                    window.scrollTo(0, 0);
                  }}
                  className="lg:hover:underline"
                >
                  Shipping Policy
                </button>
              </li>
              <li className="last:mb-0">
                <button
                  onClick={() => {
                    navigate('/terms');
                    window.scrollTo(0, 0);
                  }}
                  className="lg:hover:underline"
                >
                  Terms of Service
                </button>
              </li>
               <li className="last:mb-0">
                <button
                  onClick={() => {
                    navigate('/address');
                    window.scrollTo(0, 0);
                  }}
                  className="lg:hover:underline"
                >
                  Address Details
                </button>
              </li>
            </ul>
          </div>

          {/* Column C - CONTACT US */}
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-xl mb-4">CONTACT US</h3>
            <div className="space-y-2 text-base">
              <p>Earth Crust Pvt Ltd</p>
              <p>CIN: U15549DL2020PTC365385</p>
              <p>329, 1st Floor, Indra Vihar, Delhi-110009</p>
              <p>
                <span
                  onClick={() => handleEmailClick('ecom@earthcrust.co.in')}
                  className="underline cursor-pointer lg:hover:text-gray-300"
                >
                  ecom@earthcrust.co.in
                </span>
              </p>
              <p>+91-9654-932-262</p>

              <p className="mt-3">For export queries mail us</p>
              <p>
                <span
                  onClick={() => handleEmailClick('export@earthcrust.co.in')}
                  className="underline cursor-pointer lg:hover:text-gray-300"
                >
                  export@earthcrust.co.in
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile */}
      <footer
        className="
          block md:hidden lg:hidden
          bg-[#1E2541] text-white w-full
          pt-3 pb-4 px-3
          mb-0
          overflow-hidden         /* clip children */
        "
      >
        <div className="flex flex-col items-start [&_*]:m-0">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-[53px] object-contain mb-2 block"
          />

          <div className="flex flex-col gap-1 text-[12px] font-[400] text-white">
            <p>Earth Crust Pvt Ltd</p>
            <p>CIN: U15549DL2020PTC365385</p>
            <p>329, 1st Floor, Indra Vihar, Delhi-110009</p>
          </div>

          {/* Contact Toggle */}
          <button
            type="button"
            className="mt-2 w-full text-white text-[14px] font-[600] flex flex-row justify-between items-center"
            onClick={() => setShowContact((v) => !v)}
          >
            <span>Contact</span>
            <span className="pt-1">
              {showContact ? <BiMinus style={{ strokeWidth: 1 }} /> : <BiPlus style={{ strokeWidth: 1 }} />}
            </span>
          </button>

          {/* Contact Details */}
          {showContact && (
            <div className="flex flex-col pt-1 text-[12px] font-[400] text-white">
              <button
                type="button"
                onClick={() => handleEmailClick('ecom@earthcrust.co.in')}
                className="underline text-left"
              >
                ecom@earthcrust.co.in
              </button>
              <div>+91-9654-932-262</div>
              <div>For export queries mail us at</div>
              <button
                type="button"
                onClick={() => handleEmailClick('export@earthcrust.co.in')}
                className="underline text-left"
              >
                export@earthcrust.co.in
              </button>
            </div>
          )}

          {/* Get Help Toggle */}
          <button
            type="button"
            className="mt-2 w-full text-white text-[14px] font-[600] flex flex-row justify-between items-center"
            onClick={() => setShowHelp((v) => !v)}
          >
            <span>Get Help</span>
            <span className="pt-1">
              {showHelp ? <BiMinus style={{ strokeWidth: 1 }} /> : <BiPlus style={{ strokeWidth: 1 }} />}
            </span>
          </button>

          {/* Get Help Links */}
          {showHelp && (
            <div className="flex flex-col py-1 text-[12px] font-[400] text-white">
              <button className="text-left" onClick={() => { navigate('/search'); window.scrollTo(0, 0); }}>Search</button>
              <button className="text-left" onClick={() => { navigate('/refund-policy'); window.scrollTo(0, 0); }}>Refund & Cancellations</button>
              <button className="text-left" onClick={() => { navigate('/shipping-policy'); window.scrollTo(0, 0); }}>Shipping Policy</button>
              <button className="text-left" onClick={() => { navigate('/terms'); window.scrollTo(0, 0); }}>Terms of Service</button>
            </div>
          )}

          <div className="flex flex-row gap-2 mt-2">
            <img
              src={assets.facebook}
              alt="facebook"
              className="h-[14px] cursor-pointer block"
              onClick={() =>
                handleSocialClick('https://www.facebook.com/people/Lets-Try/100067844378739/')
              }
            />
            <img
              src={assets.instagram}
              alt="instagram"
              className="h-[14.5px] cursor-pointer block"
              onClick={() => handleSocialClick('https://www.instagram.com/letstry_foods/')}
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
