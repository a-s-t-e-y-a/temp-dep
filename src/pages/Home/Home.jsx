// src/pages/Home/Home.jsx
import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading.jsx";
import { FaWhatsapp } from "react-icons/fa";
// Direct imports for critical components (load immediately)
import ResponsiveBanner from "../../components/ResponsiveBanner/ResponsiveBanner";
import { useLocation, Link } from 'react-router-dom';

// Lazy imports for heavy/below-the-fold components
const Bestseller = lazy(() => import("../../components/Bestseller/Bestseller"));
const BestsellingCombos = lazy(() =>
  import("../../components/BestsellingCombos/BestsellingCombos")
);
const HealthySnacking = lazy(() =>
  import("../../components/HealthySnacking/HealthySnacking")
);
const WholesomeChoices = lazy(() =>
  import("../../components/WholesomeChoices/WholesomeChoices")
);
const JourneyVideos = lazy(() =>
  import("../../components/JourneyVideos/JourneyVideos")
);
const CustomerTestimonials = lazy(() =>
  import("../../components/CustomerTestimonials/CustomerTestimonials")
);
const BrandSlider = lazy(() => import("../../components/BrandSlider/BrandSlider"));
const Squares = lazy(() => import("../../components/Squares/Squares"));

// const GiftingSection = lazy(() =>
//   import("../../components/giftingSection/GiftingSection")
// );

//mate tga component
import MetaTag from "../../components/MateTagComponent/MetaTag";


const Home = () => {
 
  const navigate = useNavigate();
  const whatsappLink = "https://wa.me/7082300723?text=Hi%20I%20want%20to%20order";
const API_BASE =  import.meta.env.VITE_API_URL;
const VITE_API_IMAGE_URL= import.meta.env.VITE_API_IMAGE_URL;

  const location = useLocation();

  // Smooth scroll if a banner requested it
  React.useEffect(() => {
    const target = location.state?.scrollTarget;
    if (!target) return;

    let attempts = 0;
    const maxAttempts = 20;          // ~2 seconds
    const interval = 100;

    const tryScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        history.replaceState({}, '', window.location.pathname);
        return true;
      }
      return false;
    };

    if (tryScroll()) return;

    const id = setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= maxAttempts) {
        clearInterval(id);
      }
    }, interval);

    return () => clearInterval(id);
  }, [location.state]);


  // ---------- Prefetch helper ----------
  // simple global cache (survives route changes)
  const categoryCache = (() => {
    if (!window.__categoryCache) window.__categoryCache = new Map();
    return window.__categoryCache; // key: category, value: { data, ts }
  })();

  const CACHE_TTL = 60_000; // 60s

  async function prefetchCategory(category) {
    const key = String(category);
    const cached = categoryCache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

    try {
      const res = await fetch(
        `${API_BASE}/api/foods?category=${encodeURIComponent(key)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      categoryCache.set(key, { data, ts: Date.now() });
      return data;
    } catch {
      // best-effort prefetch; ignore errors
      return null;
    }
  }

  const favourites = [
    { name: "Purani Delhi", img:  `${VITE_API_IMAGE_URL}/images/purani_delhi.webp`},
    { name: "Indian Sweets", img: `${VITE_API_IMAGE_URL}/images/indian_sweets.webp` },
    { name: "Healthy Snacks", img: `${VITE_API_IMAGE_URL}/images/makhana.webp` },
    { name: "Bhujia", img: `${VITE_API_IMAGE_URL}/images/bhujia.webp` },
    { name: "Munchies", img: `${VITE_API_IMAGE_URL}/images/munchies.webp` },
    { name: "Fasting Special", img: `${VITE_API_IMAGE_URL}/images/fasting_special.webp` },
    { name: "South Range", img: `${VITE_API_IMAGE_URL}/images/south_range.webp` },
    { name: "Rusk", img: `${VITE_API_IMAGE_URL}/images/rusk.webp` },
    { name: "Cookies", img: `${VITE_API_IMAGE_URL}/images/cookies.webp` },
    { name: "Chips n Crisps", img: `${VITE_API_IMAGE_URL}/images/chips_%26_crisps.webp` },
    { name: "Cake & Muffins", img: `${VITE_API_IMAGE_URL}/images/cakes.webp` },
    { name: "Pratham", img: `${VITE_API_IMAGE_URL}/images/pratham.webp` },
  ];

   const favouritesUpdate = [
    { name: "Purani Delhi", img:  `${VITE_API_IMAGE_URL}/images/update_category/purani-delhi.webp`},
    { name: "Indian Sweets", img: `${VITE_API_IMAGE_URL}/images/update_category/indian-sweets.webp` },
    { name: "Healthy Snacks", img: `${VITE_API_IMAGE_URL}/images/update_category/healthy-snacks.webp` },
    { name: "Bhujia", img: `${VITE_API_IMAGE_URL}/images/update_category/bhujia.webp` },
    { name: "Munchies", img: `${VITE_API_IMAGE_URL}/images/update_category/munchies.webp` },
    { name: "Fasting Special", img: `${VITE_API_IMAGE_URL}/images/update_category/fasting-special.webp` },
    { name: "South Range", img: `${VITE_API_IMAGE_URL}/images/update_category/south-range.webp` },
    { name: "Rusk", img: `${VITE_API_IMAGE_URL}/images/update_category/rusk.webp` },
    { name: "Cookies", img: `${VITE_API_IMAGE_URL}/images/update_category/cookies.webp` },
    { name: "Chips & Crisps", img: `${VITE_API_IMAGE_URL}/images/update_category/chips-&-crisps.webp` },
    { name: "Cake & Muffins", img: `${VITE_API_IMAGE_URL}/images/update_category/cakes.webp` },
    { name: "Pratham", img: `${VITE_API_IMAGE_URL}/images/update_category/pratham.webp` },
  ];

  // Warm a few popular categories on mount (best-effort)
  useEffect(() => {
    favourites.slice(0, 4).forEach(({ name }) => prefetchCategory(name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFavouriteClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className="mb-0 p-0">
      {/* Meta Tags for SEO */}
      <MetaTag
        title="Letstry - Healthy and Tasty Snacks Delivered to Your Doorstep"
        description="Discover a wide range of healthy and delicious snacks at Letstry. From traditional Indian sweets to nutritious munchies, we have something for everyone. Order now and enjoy fast delivery!"
        ogTitle="Letstry - Your Destination for Healthy and Tasty Snacks"
        ogDescription="Explore Letstry for a variety of healthy snacks and traditional Indian treats. Fast delivery and great taste guaranteed. Order your favorite snacks today!"
      />

      {/* Hero Banner */}
      <ResponsiveBanner />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full shadow-lg p-3
                   hover:bg-green-600 transition-colors z-50"
      >
        <FaWhatsapp size={32} />
      </a>
      {/* Favourites as clickable categories */}
      <section id="favourites" className="px-4 sm:px-3 md:px-6 lg:px-10 mt-3 lg:my-10">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black mb-2 sm:mb-1  lg:mb-8 px-1">
          Find your favourite
        </h2>

        <div
          className="lg:mt-4 md:mt-4 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 
                  gap-x-1 gap-y-[6px] sm:gap-x-2 sm:gap-y-[10px] lg:gap-x-4 lg:gap-y-6 px-0 sm:px-2"
        >
          {favouritesUpdate.map(({ name, img }) => (
            <div
              key={name}
              className="text-center cursor-pointer lg:hover:scale-105 transition-transform"
              onMouseEnter={() => prefetchCategory(name)}
              onTouchStart={() => prefetchCategory(name)}
              onClick={() => handleFavouriteClick(name)}
            >
              <img
                src={img}
                alt={name}
                loading="lazy"
                className="w-full h-[64px] sm:h-[88px] lg:h-36 object-contain mb-[2px] sm:mb-[4px] lg:mb-2 rounded"
              />
              <p className="text-[10px] sm:text-[12px] lg:text-sm font-[700] text-black leading-snug">
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* <section id="gifting" >
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <GiftingSection/>
      </Suspense>
      </section> */}

      <section id="combos" >
      <Suspense fallback={<Loading/>}>
        <BestsellingCombos />
      </Suspense>
      </section>

      <section id="bestseller" >
      <Suspense fallback={<Loading/>}>
        <Bestseller />
      </Suspense>
      </section>

      <section className="bg-[#F3EEEA] py-2 ">
        <h2 className="text-center text-lg md:text-2xl lg:text-3xl font-bold text-black mt-2 mb-4 ">
          Order the snacks that really benefit your health
        </h2>
        <Suspense fallback={<Loading/>}>
          <Squares />
        </Suspense>
      </section>
      <section id="wholesome-choices" >
      <Suspense fallback={<Loading/>}>
        <div className="mt-4 md:mt-8 lg:mt-12 xl:mt-14">
          <WholesomeChoices />
        </div>
      </Suspense>
      </section>



      {/* Why Choose Us Section */}
      <section className="mt-3 px-4 text-center">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black mb-0">
          Why choose us?
        </h2>
        <img
          src={`${VITE_API_IMAGE_URL}/tableupdated.png`}
          alt="Why Choose Us"
          className="w-full max-w-5xl mx-auto rounded-xl object-contain"
          loading="lazy"
        />
      </section>



      <Suspense fallback={<Loading/>}>
        <HealthySnacking />
      </Suspense>

      <Suspense fallback={<Loading/>}>
        <JourneyVideos />
      </Suspense>

      <Suspense fallback={<Loading/>}>
        <CustomerTestimonials />
      </Suspense>

      <section className="mt-[-10px] mb-10 px-2">
        <Suspense fallback={<Loading/>}>
          <BrandSlider />
        </Suspense>
      </section>
    </div>
  );
};

export default Home;
