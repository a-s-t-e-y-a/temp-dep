import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoArrowUpRight } from "react-icons/go";

const VITE_API_IMAGE_URL= import.meta.env.VITE_API_IMAGE_URL;


const slides = [
  {
    title: 'Crunchy. Quick. Healthy.',
    description: `Start your day with Khari as it is a light and satisfying choice.\nIt’ll provide you with quick energy with their carbohydrate content and will be easier to digest.\nChoosing it will definitely prove to be a healthier option.`,
    tag: 'Breakfast',
    img: `${VITE_API_IMAGE_URL}/images/HealthySnack_1.webp`,
    redirectTo: '/category/Purani Delhi',
  },
  {
    title: 'Crunch. Focus. Conquer.',
    description: `Fuel your focus with our healthy namkeens—perfect for study breaks! Made with 100% groundnut oil and wholesome ingredients, our snacks give the right crunch without the guilt. Whether prepping for exams or powering through assignments, these light yet satisfying bites help keep energy up and mind sharp.`,
    tag: 'Study Breaks',
    img: `${VITE_API_IMAGE_URL}/images/HealthySnack_2.webp`,
    redirectTo: '/range/Namkeen Range',
  },
  {
    title: 'Light. Crunchy. Anywhere.',
    description: `Snack smart while you travel with our wide range of makhana and puffs—light, crunchy, and packed with goodness. Whether on a road trip, catching a flight, or just commuting, these healthy snacks are easy to carry and perfect for guilt-free munching on the go.`,
    tag: 'Travelling',
    img: `${VITE_API_IMAGE_URL}/images/HealthySnack_4.webp`,
    redirectTo: '/category/Munchies',
  },
  {
    title: 'Protein. Power. Purity.',
    description: `Recharge naturally after a workout with our nutritious sattu—packed with protein, fiber, and essential minerals. It's a perfect post-workout drink to help rebuild muscle, boost energy, and keep you full and refreshed without added sugar or preservatives.`,
    tag: 'Post Workout',
    img: `${VITE_API_IMAGE_URL}/images/HealthySnack_3.webp`,
    redirectTo: '/category/Healthy Snacks',
  },
  {
    title: 'Wholesome. Focused. Ready.',
    description: `Take a wholesome pause during meetings with our Paachmeva mix and healthy cookies—loaded with the goodness of dry fruits and whole grains. They offer the right balance of taste and nutrition—keeping energy steady, focus sharp, and the day on track.`,
    tag: 'Meeting Breaks',
    img: `${VITE_API_IMAGE_URL}/images/HealthySnack_5.webp`,
    redirectTo: '/category/Cookies',
  },
];

const HealthySnacking = () => {
  const [current, setCurrent] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const manualTimeout = useRef(null);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    pauseAutoSlideTemporarily();
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    pauseAutoSlideTemporarily();
  };

  const handleImageClick = () => {
    const redirect = slides[current].redirectTo;
    if (Array.isArray(redirect)) {
      redirect.forEach((route) => window.open(route, '_blank'));
    } else {
      navigate(redirect);
    }
  };

  const handleDotClick = (index) => {
    setCurrent(index);
    pauseAutoSlideTemporarily();
  };

  const pauseAutoSlideTemporarily = () => {
    setIsManual(true);
    clearTimeout(manualTimeout.current);
    manualTimeout.current = setTimeout(() => {
      setIsManual(false);
    }, 10000); // resume auto-slide after 10s
  };

  useEffect(() => {
    if (isManual) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isManual]);

  return (
    <section
      className="w-full py-4 px-2"
      style={{ background: 'linear-gradient(180deg,#FFFFFF,#FAEFEB,#FFF0EA,#FFFFFF)' }}
    >
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black text-center lg:mb-10 md:mb-10">
        Healthier ways to Enjoy your everyday Snacking!
      </h2>

      {/* Main content */}
      <div className="flex flex-row items-center justify-center max-w-6xl lg:mb-16 lg:mx-12 gap-8 md:gap-10 mx-auto">
        {/* Fixed image box to prevent layout shift */}
        <div
          className="relative inline-block cursor-pointer 
                     w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-w-[360px] aspect-square"
          onClick={handleImageClick}
        >
          <img
            key={current}
            src={slides[current].img}
            alt={slides[current].tag}
            className="w-full h-full object-cover rounded-[12px] shadow-md"
          />
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 lg:bottom-3 lg:right-3 bg-[#FFFFFF66] p-1 md:p-1.5 lg:p-2 rounded-full shadow z-10">
            <GoArrowUpRight className="text-white w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </div>
        </div>

        {/* Stabilized text column */}
        <div className="w-[80%] md:w-[450px] flex flex-col justify-center text-left lg:py-6 md:py-6 stable-copy">
          <h3
            className="text-[12px] md:text-2xl lg:font-bold mb-3 md:mb-5 text-transparent bg-clip-text animate-shine leading-tight"
            style={{
              backgroundImage: 'linear-gradient(120deg, #fa7632 40%, #ffc187 50%, #fa7632 60%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {slides[current].title}
          </h3>

          <p
            key={current}
            className="text-gray-800 text-[10px] md:text-base leading-relaxed whitespace-pre-line description"
          >
            {slides[current].description}
          </p>
        </div>
      </div>

      {/* Stepper + navigation */}
      <div className="relative flex items-center mt-6 lg:mt-4 md:mt-4 justify-center lg:px-4">
        <div className="w-full max-w-5xl relative">
          <div className="absolute w-[80%] left-0 lg:top-[22%] md:top-[18%] top-[12%] h-[2px] bg-[#FFD3B3] z-0 transform -translate-y-1/2 overflow-hidden">
            {/* Base progress bar */}
            <div
              className="h-full bg-[#FF5400] absolute top-0 left-0"
              style={{
                width: `${(current / (slides.length - 1)) * 100}%`,
                transition: 'width 0s',
              }}
            />
            {/* Animated current segment */}
            {current < slides.length - 1 && (
              <div
                key={current}
                className="h-full bg-[#FF5400] absolute top-0 origin-left animate-fillSegment"
                style={{
                  left: `${(current / (slides.length - 1)) * 100}%`,
                  width: `${100 / (slides.length - 1)}%`,
                }}
              />
            )}
          </div>

          <div className="relative z-10 flex justify-between">
            {slides.map((slide, index) => (
              <div key={index} className="flex flex-col items-start w-[20%] relative">
                <div className="absolute lg:w-6 lg:h-6 w-3 h-3 rounded-full bg-grey z-0 top-0 left-1/2 transform -translate-x-1/2"></div>
                <div
                  onClick={() => handleDotClick(index)}
                  className={`lg:w-6 lg:h-6 w-3 h-3 rounded-full z-10 relative mb-1 cursor-pointer ${
                    index === current ? 'bg-[#FF5400]' : 'bg-gray-500 border border-[#FF5400]'
                  }`}
                />
                <button
                  onClick={() => handleDotClick(index)}
                  className={`lg:text-[14px] md:text-[14px] text-[10px] text-left lg:pl-2 pl-1 font-[400] transition-all duration-200 ${
                    index === current ? 'text-orange-600 font-[700]' : 'text-gray-700'
                  }`}
                >
                  {slide.tag}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2 md:gap-4 top-[20%] -translate-y-4 md:-translate-y-2 relative z-10">
          <button
            onClick={prevSlide}
            className="border-2 border-[#807171] rounded-full flex items-center justify-center 
                       w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
          >
            <FaChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="border-2 border-[#807171] rounded-full flex items-center justify-center 
                       w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
          >
            <FaChevronRight className="w-3 h-3 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Styles to stabilize height and clamp text */}
      <style>{`
        /* Lock overall text stack height per breakpoint (tune as needed) */
        .stable-copy { min-height: 180px; }
        @media (min-width: 768px) { .stable-copy { min-height: 280px; } }
        @media (min-width: 1024px) { .stable-copy { min-height: 320px; } }

        /* Clamp description lines so long copy doesn't grow the box */
        .description {
          display: -webkit-box;
          -webkit-line-clamp: 9;              /* adjust per breakpoint */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (min-width: 768px) { .description { -webkit-line-clamp: 8; } }
        @media (min-width: 1024px) { .description { -webkit-line-clamp: 9; } }

        /* Subtle shine for title text */
        @keyframes shine {
          from { background-position: 0% 50%; }
          to   { background-position: 200% 50%; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }

        /* Progress segment fill (same as before) */
        @keyframes fillSegment {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .animate-fillSegment {
          transform-origin: left;
          animation: fillSegment 4000ms linear forwards;
        }
      `}</style>
    </section>
  );
};

export default HealthySnacking;
