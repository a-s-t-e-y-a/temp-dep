import React, { useRef, useEffect } from 'react';
import avatar from '../../assets/avatar.png';
import { FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Vipin Sharma',
    title: 'Amazing taste',
    text: 'Perfect snack for summer, light and tasty. A better and healthy snacking item with good spicy taste...',
  },
  {
    name: 'Pooja Verma',
    title: 'Truly Addictive!',
    text: 'Crispy and full of flavor! My family can’t get enough of these snacks. Loved the packaging too.',
  },
  {
    name: 'Amit Raj',
    title: 'Light and Crunchy',
    text: 'This has become my go-to for tea time. Tastes fresh and has just the right amount of seasoning.',
  },
  {
    name: 'Neha Gupta',
    title: 'Deliciously Healthy',
    text: 'Snacking guilt-free is finally possible. My kids love it and I love how natural it feels.',
  },
  {
    name: 'Rahul Mehta',
    title: 'Perfect Travel Buddy',
    text: 'I always carry a pack during trips. Doesn’t get soggy and satisfies my munch cravings.',
  },
  {
    name: 'Simran Kaur',
    title: 'Five Stars!',
    text: 'Highly recommend! Balanced flavors and super light on the stomach. Will definitely reorder.',
  },
];

const CustomerTestimonials = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollContainerRef = useRef(null);

  const scrollByAmount = 300;
  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(
      cardsRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
         once: true,
        },
      }
    );
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full lg:px-2 md:px-2 lg:pt-8 md:pt-8 pb-4 bg-white"
    >
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black lg:mb-6 md:mb-4 ml-7">
        Let our customer’s speak for us
      </h2>

      <div className="relative px-4">
        {/* Left Arrow */}
        

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scroll-smooth gap-4 pl-1 pr-1 py-2 hide-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            touchAction: 'pan-x',
          }}
        >
          {testimonials.map((t, i) => (
            <div
  key={i}
  ref={(el) => (cardsRef.current[i] = el)}
  className="flex-shrink-0 border-[2.5px] border-[#D9D9D9] lg:px-[20px] lg:py-[20px] md:px-[20px] md:py-[20px] px-[10px] py-[10px] bg-white flex flex-col justify-between
    h-[150px] w-[170px] md:w-[225px] md:h-[210px] lg:w-[380px] lg:h-[250px] scroll-snap-align-start transition-all"
  style={{
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)' // right and bottom
  }}
>

              <div>
                <h3 className="font-bold text-[12px] md:text-[15px] lg:text-[24px] lg:mb-3 text-[#0C5273]">
                  {t.title}
                </h3>
                <p className="text-[10px] md:text-[13px] lg:text-[19px] text-black leading-snug">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                
                  <img
                    src={avatar}
                    alt={t.name}
                    className="max-w-full lg:h-10 h-6 rounded-full object-cover"
                  />
                  
                <div className="flex flex-col items-end lg:gap-2 md:gap-2">
                <div className="text-[8px] md:text-[14px] lg:text-[14px] mt-3 font-medium text-black">
                    {t.name}
                  </div>
                {/* <button className="bg-[#0C5273] text-white text-[8px] md:text-[14px] lg:text-[14px] px-2 lg:py-[2px] md:py-[2px] py-[1px] lg:rounded md:rounded rounded-[2px] flex items-center gap-1 mt-1">
                  <FaPlay className="lg:text-[8.5px] md:text-[8.5px] text-[6px]" />
                  <span>Watch Full Story</span>
                </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <div className="flex justify-center space-x-4 mt-3">
                <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' })}
                            className=" border-2 border-[#807171] rounded-full flex items-center justify-center 
                               w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
                          >
                            <FaChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => scrollContainerRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' })}
                            className=" border-2 border-[#807171] rounded-full flex items-center justify-center 
                               w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
                          >
                            <FaChevronRight className="w-3 h-3 md:w-5 md:h-5" />
                          </button>
                          
              </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
