import React, { useEffect, useRef, useState } from "react";
import GiftingProductCard from "./GiftingProductCard";
import { fetchGiftingProducts } from "../../service/foodService";

import topBar from "../../assets/gifting/top-bg.gif";
import middleBar from "../../assets/gifting/font.gif";
import bottomBar from "../../assets/gifting/bottom-bg.png";

export default function GiftingSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const scrollerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("loading");
      try {
        const data = await fetchGiftingProducts();
        if (mounted) {
          setItems(Array.isArray(data) ? data : []);
          setStatus("success");
        }
      } catch (err) {
        console.error(err);
        if (mounted) setStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const EPS = 2;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxLeft = Math.max(0, scrollWidth - clientWidth);
      setAtStart(scrollLeft <= EPS);
      setAtEnd(scrollLeft >= maxLeft - EPS);
    };

    // initial + listeners
    requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const scrollByCards = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });

    const check = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxLeft = Math.max(0, scrollWidth - clientWidth);
      const EPS = 2;
      setAtStart(scrollLeft <= EPS);
      setAtEnd(scrollLeft >= maxLeft - EPS);
    };
    setTimeout(check, 180);
    setTimeout(check, 400);
  };

  return (
    <section
      aria-label="Curated Hampers"
      className={[
        "relative isolate",
        "bg-no-repeat bg-top bg-contain",
        "bg-[image:var(--top-img)]",
        // More space on mobile so content starts under the top ornament
        "pt-[min(1px,22vw)] sm:pt-[min(20px,14vw)] md:pt-[min(50px,10vw)]",
        "pb-[min(56px,8vw)]",
      ].join(" ")}
      style={{ ["--top-img"]: `url(${topBar})` }}
    >
      {/* Middle divider – relaxed on mobile, slight lift on larger screens */}
      <div className="flex justify-center mt-0 md:-pt-[2%] mb-2">
        <img
          src={middleBar}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-[50%] sm:w-[58%] md:w-[42%] max-w-[900px] select-none pointer-events-none"
        />
      </div>

      {/* Carousel – do not pull up on mobile; gently nudge at sm/md */}
      <div className="w-[92%] max-w-[92%] mx-auto relative -mt-10 md:-mt-[10%]">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          className={[
            "hidden md:flex",
            "items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2",
            "h-10 w-10 rounded-full bg-white/90 shadow hover:bg-white focus:outline-none",
            atStart ? "md:invisible" : "md:visible",
          ].join(" ")}
          aria-label="Previous"
        >
          <span className="inline-block rotate-180 select-none">›</span>
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-1 pb-1 hide-scrollbar"
        >
          {status === "loading" && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[68vw] sm:w-[52vw] md:w-[215px] lg:w-[270px] h-[290px] rounded-xl shadow-[0_6px_14px_rgba(0,0,0,0.08)] animate-pulse bg-gradient-to-r from-[#eee] via-[#f7f7f7] to-[#eee]"
                />
              ))}
            </>
          )}

          {status === "error" && (
            <div className="w-full text-center py-6 text-neutral-700">
              Failed to load hampers, please try again.
            </div>
          )}

          {status === "success" && items.length === 0 && (
            <div className="w-full text-center py-6 text-neutral-700">
              No hampers available.
            </div>
          )}

          {status === "success" && items.length > 0 && (
            <>
              {items.map((p) => (
                <div
                  key={p.id || p.sku}
                  data-card
                  // Clean, non-conflicting widths: percentage on small, fixed from md+
                  className="snap-start shrink-0 w-[30vw] sm:w-[52vw] md:w-[215px] lg:w-[270px]"
                >
                  <GiftingProductCard product={p} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          className={[
            "hidden md:flex",
            "items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2",
            "h-10 w-10 rounded-full bg-white/90 shadow hover:bg-white focus:outline-none",
            atEnd ? "md:invisible" : "md:visible",
          ].join(" ")}
          aria-label="Next"
        >
          <span className="inline-block select-none">›</span>
        </button>
      </div>

      {/* Bottom decorative bar – give more space on mobile */}
      <div className="flex justify-center mt-3 sm:mt-10 md:mt-12 -mb-5">
        <img
          src={bottomBar}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full sm:w-full max-w-full select-none pointer-events-none"
        />
      </div>

      {/* hide-scrollbar utility (Tailwind + webkit) */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
