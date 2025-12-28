import React, { useState, useEffect, useContext, useRef } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useClickSpark } from "../ClickSpark/useClickSpark";
import "swiper/css";
import "swiper/css/navigation";
import confetti from "canvas-confetti";
import { useAuth } from "../../context/AuthContext";
import { fetchBestsellers } from "../../service/foodService";
import { faViewItemList, faSelectItem } from "../../analytics/ga4";

const Bestseller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const triggerSpark = useClickSpark();
  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } =
    useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const bestsellerRef = useRef(null);
  const hasShownConfetti = useRef(false);
  const confettiContainerRef = useRef(null);
  const { idToken } = useAuth();
  const listImpressionSentRef = useRef(false);

  const LIST_ID = "bestseller_home";
  const LIST_NAME = "Bestseller";

  useEffect(() => {
    let isActive = true; // optional guard to avoid state updates after unmount

    const load = async () => {
      if (location.pathname !== "/") {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchBestsellers(); // service function returns products
        if (!isActive) return;
        setProducts(data);
        setError(null);
      } catch (e) {
        if (!isActive) return;
        setError("Failed to load bestseller products");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [location.pathname]);

  const handleOnClick = (p, idx) => {
    const hasDiscount = p.discountPercent > 0;
    const price = hasDiscount
      ? (p.price * (100 - p.discountPercent)) / 100
      : p.price;

    const item = {
      item_id: String(p.id),
      item_name: p.name,
      item_brand: "LetsTryFoods",
      item_category: p.category,
      item_variant: p.unit || p.weight || undefined,
      price: Number(Number(price).toFixed(2)),
      quantity: 1,
      index: idx,
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
    };

    faSelectItem({
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
      items: [item],
    });

    navigate(`/food/${encodeURIComponent(p.id)}`);
  };

  // Clear confetti flag on every full page reload to enable confetti burst again
  useEffect(() => {
    sessionStorage.removeItem("bestsellerConfettiFired");
  }, []);

  // Initialize confetti shown state from sessionStorage on mount
  useEffect(() => {
    const hasFired = sessionStorage.getItem("bestsellerConfettiFired");
    hasShownConfetti.current = hasFired === "true";
  }, []);

  // Fire view_item_list once when section becomes visible
  useEffect(() => {
    const el = bestsellerRef.current;
    if (!el) return;
    if (!products || products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
        if (!visible) return;

        if (!listImpressionSentRef.current) {
          const items = products.map((p, idx) => {
            const hasDiscount = p.discountPercent > 0;
            const price = hasDiscount
              ? (p.price * (100 - p.discountPercent)) / 100
              : p.price;
            return {
              item_id: String(p.id),
              item_name: p.name,
              item_brand: p.brand || "LetsTryFoods",
              item_category: p.category || "Snacks",
              item_variant: p.unit || p.weight || undefined,
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

        // Existing confetti logic
        if (!hasShownConfetti.current) {
          const canvas = document.createElement("canvas");
          Object.assign(canvas.style, {
            position: "absolute",
            top: "-120px",
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 50,
          });
          if (confettiContainerRef.current) {
            confettiContainerRef.current.appendChild(canvas);
          }
          hasShownConfetti.current = true;
          sessionStorage.setItem("bestsellerConfettiFired", "true");

          const myConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: true,
          });
          setTimeout(() => {
            myConfetti({
              particleCount: 180,
              spread: 100,
              startVelocity: 25,
              ticks: 90,
              origin: { y: 0.4 },
            });
            setTimeout(() => {
              if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
              }
            }, 2200);
          }, 50);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [products, location.pathname]);

  if (location.pathname !== "/") return null;

  if (loading) {
    return (
      <section
        ref={bestsellerRef}
        className="relative mt-6 px-6 pt-6 sm:pb-10 md:pb-10 lg:pb-16 overflow-hidden bg-[#449095]"
      >
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <ul className="floating-circles w-full h-full relative">
            {[...Array(25)].map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-center">
          <div className="festival-heading-wrap relative inline-block">
            {products.length > 0 && (
              <div
                key={products.length}
                className="confetti-burst absolute inset-0 z-0 pointer-events-none w-full h-full"
              />
            )}
            <h2
              className="festival-heading text-[30px] sm:text-[38px] lg:text-[48px] font-bold text-center"
              style={{
                fontFamily: "Agbalumo",
                padding: "8px 580px",
                borderRadius: "12px",
                marginBottom: 0,
                position: "relative",
                zIndex: 4,
              }}
            >
              Bestseller
            </h2>
          </div>
          <div className="animate-spin w-10 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mt-2" />
        </div>
        <FestivalStyle />
      </section>
    );
  }

  if (error) {
    return (
      <section
        ref={bestsellerRef}
        className="relative mt-6 px-6 pt-6 sm:pb-10 md:pb-10 lg:pb-16 overflow-hidden bg-[#449095]"
      >
        <div
          ref={confettiContainerRef}
          className="absolute inset-0 pointer-events-none z-50"
        />
        <div className="festival-heading-wrap relative inline-block">
          <div className="confetti-burst absolute inset-0 z-0 pointer-events-none" />
          <h2
            className="festival-heading text-[30px] sm:text-[38px] lg:text-[48px] font-bold text-center "
            style={{ fontFamily: "Agbalumo" }}
          >
            Bestseller
          </h2>
        </div>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
        <FestivalStyle />
      </section>
    );
  }

  // bg color ==>  #973E14

  return (
    <section
      ref={bestsellerRef}
      className="relative mt-6 px-4 sm:px-6 lg:px-8 pt-2 sm:pb-5 md:pb-5 lg:pb-8 overflow-hidden"
       style={{
        backgroundImage: 'url(https://d11a0m43ek7ap8.cloudfront.net/backgroundUpdate.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        ref={confettiContainerRef}
        className="absolute inset-0 pointer-events-none z-50"
      />
      {/* <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ul className="floating-circles w-full h-full relative">
          {[...Array(25)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div> */}
      <div className="relative z-10">
        <div className="flex justify-center items-center mb-6">
          <div className="festival-heading-wrap relative inline-block">
            <div className="confetti-burst absolute inset-0 z-0 pointer-events-none" />
            <h2
              className="festival-heading text-[40px] sm:text-[44px] lg:text-[56px] font-bold text-center py-2"
              style={{
                fontFamily: "Agbalumo",
                borderRadius: "12px",
                marginBottom: 0,
                position: "relative",
                zIndex: 4,
              }}
            >
              Bestseller
            </h2>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
          <div className="overflow-x-auto hide-scrollbar  ">
            <div className="flex gap-4 sm:gap-5 lg:gap-6 px-1 sm:px-2 lg:px-8">
              {products.map((p) => {
                if (!p?.id) return null;
                const hasDiscount = p.discountPercent > 0;
                const rawPrice = hasDiscount
                  ? (p.price * (100 - p.discountPercent)) / 100
                  : p.price;
                const discountedPrice = Number(rawPrice.toFixed(2));
                const qty = quantites?.[p.id] || 0;

                return (
                  <div
                    key={p.id}
                    className="min-w-[120px] sm:min-w-[180px] lg:min-w-[235px] "
                  >
                    <div className="relative ">
                      {hasDiscount && (
                        <>
                          <div className="absolute top-[0px] left-[23px] z-10">
                            <div
                              className="bg-[#00000020] text-[#00000020] font-bold text-[8px] md:text-[10px] lg:text-[13px] 
                                w-[30px] md:w-[45px] lg:w-[55px] pt-1 pb-[9.5px] px-[4.5px] md:px-[8px] lg:px-[10px]
                                leading-tight flex flex-col backdrop-blur-sm"
                              style={{
                                clipPath:
                                  "polygon(0 -1%, 80% -1%, 80% 100%, 40% 80%, 0 100%)",
                              }}
                            >
                              <div>{p.discountPercent}%</div>
                              <div className="pb-[6px]">OFF</div>
                            </div>
                          </div>
                          <div className="absolute top-0 left-5 z-10">
                            <div
                              className="bg-[#3149A6] text-white font-bold text-[8px] md:text-[10px] lg:text-[13px] 
                                w-[30px] md:w-[45px] lg:w-[55px] pt-1 pb-2 px-[4.5px] md:px-[8px] lg:px-[10px]
                                leading-tight flex flex-col"
                              style={{
                                clipPath:
                                  "polygon(0 -1%, 80% -1%, 80% 100%, 40% 80%, 0 100%)",
                              }}
                            >
                              <div>{p.discountPercent}%</div>
                              <div className="pb-[6px]">OFF</div>
                            </div>
                          </div>
                        </>
                      )}
                      <div
                        className="flex flex-col justify-between h-full lg:px-[20px] md:px-[15px] md:py-[15px] px-[10px] py-[10px] mb-4 lg:py-[20px] text-center lg:rounded-3xl md:rounded-2xl rounded-xl transition-shadow duration-800"
                        style={{
                          backgroundColor: "#FCEFC0",
                          boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.40)",
                        }}
                      >
                        <div
                          className="relative w-full lg:h-40 md:h-[100px] h-[70px] lg:mb-[10px] md:mb-[10px] mb-[5px] cursor-pointer"
                          onClick={() => handleOnClick(p, products.indexOf(p))}
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="lg:text-[22px] md:text-[14px] text-[12px] font-bold text-black leading-snug min-h-[35px] md:min-h-[40px] lg:min-h-[70px] lg:mb-[10px] md:mb-[10px] mb-[5px]">
                          {p.name}
                        </h3>
                        <div className="lg:text-[15px] text-[12px] text-black lg:mb-[10px] md:mb-[10px] mb-[5px] font-bold">
                          {p.unit || p.weight || ""}
                        </div>
                        <div className="lg:mb-[10px] md:mb-[10px] mb-[5px]">
                          {hasDiscount ? (
                            <div className="text-black text-center">
                              <span className="lg:text-[18px] md:text-[14px] text-[12px] font-semibold">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              <span className="line-through text-[#00000091] font-normal px-2 lg:text-[16px] md:text-[14px] text-[12px]">
                                ₹{p.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[18px] font-bold text-black">
                              ₹{discountedPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {qty > 0 ? (
                          <div className="flex justify-center">
                            <button
                              className="w-[30px] lg:w-[40px] h-[30px] pl-1 lg:pl-2 lg:h-[44px] text-[12px] lg:text-[18px] md:text-[16px]  border-[#0C5273] text-white bg-[#0C5273] font-semibold rounded-l lg:hover:bg-[#003349] transition"
                              onClick={() => decreaseQty(p.id, idToken)}
                            >
                              <FiMinus />
                            </button>
                            <input
                              type="text"
                              readOnly
                              value={qty}
                              className="w-[60px] md:w-[80px] lg:w-[120px] h-[30px] lg:h-[44px] text-[14px] lg:text-[18px] md:text-[16px] text-center border-y-2 border-[#0C5273] text-white bg-[#0C5273] rounded-none"
                            />
                            <button
                              className="w-[30px] lg:w-[40px] pl-1 lg:pl-2 h-[30px] lg:h-[44px] text-[12px] lg:text-[18px] md:text-[16px] border-2 border-[#0C5273] text-white bg-[#0C5273] font-semibold rounded-r lg:hover:bg-[#003349] transition"
                              onClick={(e) => {
                                triggerSpark(e, "#ffffff");
                                increaseQty(p.id, idToken);
                                triggerCartDrawer({
                                  id: p.id,
                                  name: p.name,
                                  imageUrl: p.imageUrl,
                                  unit: p.unit || p.weight || "200 gm",
                                  price: discountedPrice,
                                });
                              }}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <button
                              className="w-[120px] lg:w-[200px] md:w-[140px] h-[30px] lg:h-[44px] bg-[#0C5273] text-white font-semibold text-[12px] lg:text-[16px] rounded-l rounded-r lg:hover:bg-[#003349] transition"
                              onClick={(e) => {
                                triggerSpark(e, "#ffffff");
                                increaseQty(p.id, idToken);
                                triggerCartDrawer({
                                  id: p.id,
                                  name: p.name,
                                  imageUrl: p.imageUrl,
                                  unit: p.unit || p.weight || "200 gm",
                                  price: discountedPrice,
                                });
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <FestivalStyle />
    </section>
  );
};

// FESTIVAL ANIMATION CSS -- all magic is here!
function FestivalStyle() {
  return (
    <style>{`
      .festival-heading {
        background: linear-gradient(
          100deg,
          #ffd700 15%,
          #fff5ae 33%,
          #ffb100 54%,
          #fffbe3 70%,
          #ffd700 85%,
          #ffb100 100%
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        animation: festival-gold-gradient 3.7s linear infinite alternate;
        filter: drop-shadow(0 2px 6px #ffe08273) drop-shadow(0 0 32px #ffd60066);
        position: relative;
      }
      @keyframes festival-gold-gradient {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
      }
      .festival-heading::after {
        content: '';
        pointer-events: none;
        position: absolute;
        left: 2%;
        top: 5%;
        width: 96%;
        height: 94%;
        background: url('data:image/svg+xml;utf8,<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="44" cy="18" r="2" fill="white" opacity="0.76"/><circle cx="70" cy="33" r="1.5" fill="white" opacity="0.6"/><circle cx="155" cy="20" r="1.3" fill="white" opacity="0.56"/><circle cx="182" cy="45" r="1.7" fill="white" opacity="0.56"/><circle cx="147" cy="41" r="1" fill="white" opacity="0.5"/><circle cx="101" cy="13" r="1.4" fill="white" opacity="0.4"/></svg>');
        background-repeat: no-repeat;
        background-size: cover;
        animation: sparkle-float 2.4s linear infinite;
        z-index: 15;
        opacity: 0.42;
        mix-blend-mode: lighten;
      }
      @keyframes sparkle-float {
        0% { background-position: 0% 0%; opacity: 0.32;}
        25% { opacity: 0.75; }
        80% { opacity: 0.42;}
        100% { background-position: 60px 10px; opacity: 0.32;}
      }
      /* 🎉 Confetti burst */
      .confetti-burst {
        width: 100%;
        height: 100%;
        background: url("data:image/svg+xml,%3Csvg width='250' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='2'%3E%3Ccircle cx='20' cy='10' r='1'/%3E%3Ccircle cx='60' cy='20' r='1.2'/%3E%3Ccircle cx='100' cy='5' r='0.8'/%3E%3Ccircle cx='160' cy='15' r='1.5'/%3E%3Ccircle cx='200' cy='25' r='1.1'/%3E%3Ccircle cx='230' cy='10' r='1.4'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        background-size: 220px auto;
        opacity: 0;
        animation: confettiPop 1.4s ease-out forwards;
        z-index: 2;
      }

      @keyframes confettiPop {
        0% {
          transform: scale(0.7) translateY(20px);
          opacity: 0;
        }
        40% {
          opacity: 1;
        }
        100% {
          transform: scale(1) translateY(0px);
          opacity: 0.85;
        }
      }

      /* Floating background circles */
      .floating-circles {
        position: relative;
        list-style: none;
        pointer-events: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 6px;
      }
      .floating-circles li {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        animation: floatUpDown 6s ease-in-out infinite;
        animation-delay: calc(var(--i) * -0.5s);
        will-change: transform, opacity;
      }
      @keyframes floatUpDown {
        0%, 100% {
          transform: translateY(0);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-12px);
          opacity: 1;
        }
      }
    `}</style>
  );
}

export default Bestseller;
