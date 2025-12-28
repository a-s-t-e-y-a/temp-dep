import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

const Loader = ({ durationMs = 2000, exitMs = 600 }) => {
  const [show, setShow] = useState(true);
  const [slideUp, setSlideUp] = useState(false);

  // Trigger exit after durationMs (simulate page readiness or replace with real signal)
  useEffect(() => {
    const timer = setTimeout(() => setSlideUp(true), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  // Unmount after exit animation completes
  useEffect(() => {
    if (slideUp) {
      const timer = setTimeout(() => setShow(false), exitMs);
      return () => clearTimeout(timer);
    }
  }, [slideUp, exitMs]);

  // Lock scroll while visible
  useEffect(() => {
    const lock = show && !slideUp;
    const prev = document.body.style.overflow;
    document.body.style.overflow = lock ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show, slideUp]);

  if (!show) return null;

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-[9999] flex items-center justify-center
        bg-white
        ${slideUp ? "lt-slide-up" : ""}`}
    >
      <div className="flex flex-col items-center">
        {/* Pulsing logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-40 h-40 lt-fade-pulse"
          draggable={false}
        />
      </div>

      {/* Inline critical CSS for first-paint animation */}
      <style>{`
        /* Fade pulse: smooth in/out loop */
        @keyframes ltFadePulse {
          0% { opacity: 0.25; }
          50% { opacity: 1; }
          100% { opacity: 0.25; }
        }
        .lt-fade-pulse {
          animation: ltFadePulse 1.8s ease-in-out infinite;
          will-change: opacity;
        }

        /* One-time fade-in for text */
        @keyframes ltFadeInOnce {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .lt-fade-in-once {
          animation: ltFadeInOnce 500ms ease-out forwards;
        }

        /* Slide up exit for overlay */
        @keyframes ltSlideUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-16px); opacity: 0; }
        }
        .lt-slide-up {
          animation: ltSlideUp ${Math.max(exitMs, 200)}ms ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Loader;
