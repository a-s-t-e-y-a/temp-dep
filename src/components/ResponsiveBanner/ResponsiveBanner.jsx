import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { assets } from '../../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom'

// Desktop banner dimensions
const DESKTOP_BANNER_WIDTH = 1800;
const DESKTOP_BANNER_HEIGHT = 500;
// Mobile banner dimensions
const MOBILE_BANNER_WIDTH = 400;
const MOBILE_BANNER_HEIGHT = 200;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const ResponsiveBanner = () => {
  const isMobile = useIsMobile();
  const banners = isMobile
    ? (assets.mobileBanners || []).filter((b) => b.active)
    : (assets.banners || []).filter((b) => b.active);

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  if (!banners.length) return null;

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBannerClick = (banner) => {
    if (banner.link) {
      try {
        const url = new URL(banner.link, window.location.origin);
        const isInternal = url.hostname === window.location.hostname ||
          url.hostname === 'www.letstryfoods.com' ||
          url.hostname === 'letstryfoods.com';

        if (isInternal) {
          navigate(url.pathname + url.search);
        } else {
          window.location.href = banner.link;
        }
      } catch (e) {
        // Fallback for malformed links or simple paths
        if (banner.link.startsWith('http')) {
          window.location.href = banner.link;
        } else {
          navigate(banner.link);
        }
      }
      return;
    }

    const normalize = (v) => (v || '').trim().toLowerCase();
    const tag = normalize(banner.tag || banner.tag2);

    // WhatsApp case unchanged
    if (tag === 'whatsapp redirect') {
      window.location.href = "https://wa.me/7082300723?text=Hi%20I%20want%20to%20order";
      return;
    }

    // Scroll case from explicit field
    if (banner.actionType === 'scroll' && banner.tag2) {
      // if already on '/', just scroll
      if (window.location.pathname === '/') {
        scrollToId(banner.tag2);
      } else {
        // navigate to home and pass desired target in state
        navigate('/', { state: { scrollTarget: banner.tag2 }, replace: false });
      }
      return;
    }


    // Category fallback
    if (banner.tag2) {
      navigate(`/category/${banner.tag2}`);
      return;
    }
  };

  const bannerWidth = isMobile ? MOBILE_BANNER_WIDTH : DESKTOP_BANNER_WIDTH;
  const bannerHeight = isMobile ? MOBILE_BANNER_HEIGHT : DESKTOP_BANNER_HEIGHT;
  const borderRadius = isMobile ? "10px" : "16px";
  const progressBarGap = isMobile ? "gap-1" : "gap-2";
  const progressBarWidth = isMobile ? "w-6" : "lg:w-20 md:w-16 w-5";
  const progressBarBottom = isMobile ? "bottom-2" : "bottom-3";

  return (
    <section className={isMobile ? "my-2 px-2 sm:px-2 md:px-3 lg:hidden block" : "lg:my-4 md:mt-2 px-4 sm:px-3 md:px-6 lg:px-10"}>
      <div
        className={`relative w-full overflow-hidden rounded-[${borderRadius}]`}
        style={{ aspectRatio: `${bannerWidth} / ${bannerHeight}` }}
      >
        <Swiper
          modules={[Autoplay]}
          style={{ width: '100%', height: '100%' }}
          className={`rounded-[${borderRadius}]`}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          // Optional UX tweaks:
          preventClicks={false}
          preventClicksPropagation
          threshold={5}
        >
          {banners.map((banner, i) => (
            <SwiperSlide key={banner.id} className="!h-full">
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleBannerClick(banner)}
                onKeyDown={(e) => e.key === 'Enter' && handleBannerClick(banner)}
                className="relative w-full h-full cursor-pointer"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.tag2 ? `Banner for ${banner.tag2}` : 'Promotional banner'}
                  width={bannerWidth}
                  height={bannerHeight}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover rounded-[${borderRadius}] bg-gray-100`}
                />

                {/* Progress bars */}
                <div className={`absolute ${progressBarBottom} left-1/2 -translate-x-1/2 flex ${progressBarGap} z-10`}>
                  {banners.map((_, j) => (
                    <div key={j} className={`${progressBarWidth} h-1 bg-white/30 overflow-hidden rounded-sm`}>
                      <div
                        className={`h-full bg-white ${j === activeIndex
                          ? 'w-full transition-[width] duration-[2000ms] ease-linear'
                          : 'w-0'
                          }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ResponsiveBanner;
