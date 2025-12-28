import React, { useRef } from "react";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";

const getGradient = (title) => {
  switch (title) {
    case "Namkeen Range":
      return "linear-gradient(180deg, #F2B177 0%, #D6753A 100%)";
    case "Roasted Range":
      return "linear-gradient(180deg, #E39956 0%, #FACA73 100%)";
    case "South Range":
      return "linear-gradient(180deg, #B0CC7B 0%, #24AD5E 100%)";
    case "Wafers Range":
      return "linear-gradient(180deg, #E9A0AD 0%, #D12C4A 100%)";
    case "Puff Range":
      return "linear-gradient(180deg, #EAB07C 0%, #CB6000 100%)";
    case "Muffins & Cakes":
      return "linear-gradient(180deg, #B8B5EB 0%, #595782 100%)";
    case "No Palm Oil Range":
      return "linear-gradient(180deg, #C7D6A0 0%, #A2C654 100%)";
    case "Goodness of Wheat":
      return "linear-gradient(180deg, #DEC19F 0%, #B4824A 100%)";
    case "No Maida Range":
      return "linear-gradient(180deg, #BFE9EC 0%, #449095 100%)";
    default:
      return "linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)";
  }
};

const VITE_API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

const items = [
  {
    title: "Namkeen Range",
    name: "Namkeen Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/Namkeen_range.webp`,
    hasRange: true,
  },
  {
    title: "South Range",
    name: "South Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/south_range.webp`,
    hasRange: true,
  },
  {
    title: "Roasted Range",
    name: "Roasted Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/roasted_range.webp`,
    hasRange: true,
  },
  {
    title: "Wafers Range",
    name: "Wafers Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/wafers_range.webp`,
    hasRange: true,
  },
  {
    title: "Puff Range",
    name: "Puff Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/puff_range.webp`,
    hasRange: true,
  },
  {
    title: "Muffins & Cakes",
    name: "Muffins Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/muffins_range.webp`,
    hasRange: true,
  },
  {
    title: "No Palm Oil Range",
    name: "No Palm Oil Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/no_palm_oil_range.webp`,
    hasRange: true,
  },
  {
    title: "Goodness of Wheat",
    name: "Wheat Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/wheat_range.webp`,
    hasRange: true,
  },
  {
    title: "No Maida Range",
    name: "No Maida Range",
    img: `${VITE_API_IMAGE_URL}/images/wholesomechoicesimg/no_maida_range.webp`,
    hasRange: true,
  },
];

const itemsUpdated = [
  {
    title: "Namkeen Range",
    name: "Namkeen Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/namkeen_range.webp`,
    hasRange: true,
  },
  {
    title: "South Range",
    name: "South Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/south_range.webp`,
    hasRange: true,
  },
  {
    title: "Roasted Range",
    name: "Roasted Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/roasted_range.webp`,
    hasRange: true,
  },
  {
    title: "Wafers Range",
    name: "Wafers Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/wafers_range.webp`,
    hasRange: true,
  },
  {
    title: "Puff Range",
    name: "Puff Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/puff_range.webp`,
    hasRange: true,
  },
  {
    title: "Muffins & Cakes",
    name: "Muffins Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/muffins_range.webp`,
    hasRange: true,
  },
  {
    title: "No Palm Oil Range",
    name: "No Palm Oil Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/no_palm_oil_range.webp`,
    hasRange: true,
  },
  {
    title: "Goodness of Wheat",
    name: "Wheat Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/wheat_range.webp`,
    hasRange: true,
  },
  {
    title: "No Maida Range",
    name: "No Maida Range",
    img: `${VITE_API_IMAGE_URL}/images/update_images/no_maida_range.webp`,
    hasRange: true,
  },
];

const WholesomeChoices = () => {
  const navigate = useNavigate();

  const handleCardClick = (title, hasRange) => {
    if (hasRange) navigate(`/range/${encodeURIComponent(title)}`);
  };
  const scrollRef = useRef(null);

  const scrollByAmount = 300;

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F3EEEA 40%, #F3EEEA 60%, #FFFFFF 100%)",
      }}
    >
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black mb-3 mx-4 ">
        Wholesome Choices
      </h2>

      <div className="relative overflow-visible px-2 md:px-6 lg:px-8 ml-4 mr-4">
        <div className="max-w-screen overflow-hidden">
          <div
            ref={scrollRef}
            className="relative overflow-x-auto  hide-scrollbar scroll-smooth"
          >
            <div
              className="flex lg:gap-[25px] md:gap-[20px] gap-[10px] pr-4"
              style={{
                scrollSnapType: "x mandatory",
              }}
            >
              {items?.map(({ title, name, img, hasRange }) => (
                <div
                  key={name}
                  className="scrollSnap-start flex-shrink-0 w-[130px] md:w-[190px] lg:w-[300px]"
                >
                  <div className="relative w-full">
                    {!hasRange && (
                      <div
                        className="absolute top-2 left-2 z-10 
      lg:text-[14px] md:text-[10px] text-[8px] 
      flex items-center justify-center font-[500]
      rounded bg-[#0C5273] text-white p-1 max-w-[110px]"
                      >
                        Out of Stock
                      </div>
                    )}

                    <div
                      role={hasRange ? "button" : undefined}
                      tabIndex={hasRange ? 0 : -1}
                      onClick={() => handleCardClick(title, hasRange)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCardClick(title, hasRange)
                      }
                      className={`glare-hover rounded-[15px] overflow-hidden flex flex-col 
      h-[220px] md:h-[280px] lg:h-[400px] 
      w-full focus:outline-none ${hasRange ? "cursor-pointer" : ""} ${
                        !hasRange ? "opacity-70" : ""
                      }`}
                      style={{
                        background: getGradient(title),
                        backgroundSize: "cover", // ⬅️ ensures full stretch
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="flex-1 flex items-center justify-center pt-6 sm:pt-8 md:pt-10 pb-2 group">
                        <Tilt
                          tiltMaxAngleX={15}
                          tiltMaxAngleY={15}
                          glareEnable={false}
                          scale={1.05}
                          transitionSpeed={400}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div
                            className="relative w-full overflow-hidden flex items-center justify-center
  h-[90px] sm:h-[110px] md:h-[180px] lg:h-[260px]"
                          >
                            <img
                              src={img}
                              alt={name}
                              className={`transition-transform duration-300
    ${
      ["Muffins & Cakes", "No Maida Range"].includes(title)
        ? "object-contain w-auto max-w-[120px] sm:max-w-[120px] md:max-w-[200px] lg:max-w-[280px]"
        : "w-full h-full object-contain"
    }
  `}
                            />
                          </div>
                        </Tilt>
                      </div>
                      <div className="flex justify-between items-center min-h-[50px] px-3 lg:py-4 bg-white">
                        <span className="lg:text-lg text-[14px] font-bold text-black">
                          {name}
                        </span>
                        <button
                          onClick={() =>
                            hasRange && handleCardClick(title, hasRange)
                          }
                          className="bg-black p-1 rounded-full flex items-center justify-center lg:h-9 lg:w-9 w-6 h-6"
                          aria-label={`Go to ${name}`}
                        >
                          <MdOutlineArrowOutward className="lg:h-6 lg:w-6 h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="relative overflow-visible px-2 md:px-6 lg:px-8 ml-4 mr-4">
        <div className="max-w-screen overflow-hidden">
          <div
            ref={scrollRef}
            className="relative overflow-x-auto  hide-scrollbar scroll-smooth"
          >
            <div
              className="flex lg:gap-[25px] md:gap-[20px] gap-[10px] pr-4"
              style={{
                scrollSnapType: "x mandatory",
              }}
            >
              {itemsUpdated.map(({ title, name, img, hasRange }) => (
                <div
                  key={name}
                  className="scrollSnap-start flex-shrink-0 w-[130px] md:w-[190px] lg:w-[300px]"
                >
                  <div className="relative w-full">
                    {!hasRange && (
                      <div
                        className="absolute top-2 left-2 z-10 
      lg:text-[14px] md:text-[10px] text-[8px] 
      flex items-center justify-center font-[500]
      rounded bg-[#0C5273] text-white p-1 max-w-[110px]"
                      >
                        Out of Stock
                      </div>
                    )}

                    <div
                      role={hasRange ? "button" : undefined}
                      tabIndex={hasRange ? 0 : -1}
                      onClick={() => handleCardClick(title, hasRange)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCardClick(title, hasRange)
                      }
                      className={`glare-hover rounded-[30px] overflow-hidden flex flex-col 
      h-[220px] md:h-[280px] lg:h-[400px] 
      w-full focus:outline-none ${hasRange ? "cursor-pointer" : ""} ${
                        !hasRange ? "opacity-70" : ""
                      }`}
                      style={{
                        background: getGradient(title),
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="flex-1 flex items-center justify-center group">
                        <Tilt
                          tiltMaxAngleX={15}
                          tiltMaxAngleY={15}
                          glareEnable={false}
                          scale={1.05}
                          transitionSpeed={400}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                            <img
                              src={img}
                              alt={name}
                              className="w-full h-full object-cover transition-transform duration-300"
                            />
                          </div>
                        </Tilt>
                      </div>
                      <div className="flex justify-between items-center min-h-[50px] px-3 lg:py-4 bg-white">
                        <span className="lg:text-lg text-[14px] font-bold text-black">
                          {name}
                        </span>
                        <button
                          onClick={() =>
                            hasRange && handleCardClick(title, hasRange)
                          }
                          className="bg-black p-1 rounded-full flex items-center justify-center lg:h-9 lg:w-9 w-6 h-6"
                          aria-label={`Go to ${name}`}
                        >
                          <MdOutlineArrowOutward className="lg:h-6 lg:w-6 h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex justify-center space-x-10 mt-6">
        <button
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: -scrollByAmount,
              behavior: "smooth",
            })
          }
          className=" border-2 border-[#807171] rounded-full flex items-center justify-center 
                       w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
        >
          <FaChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: scrollByAmount,
              behavior: "smooth",
            })
          }
          className=" border-2 border-[#807171] rounded-full flex items-center justify-center 
                       w-6 h-6 md:w-10 md:h-10 lg:hover:bg-gray-100 transition-all duration-200"
        >
          <FaChevronRight className="w-3 h-3 md:w-5 md:h-5" />
        </button>
      </div>
    </section>
  );
};

export default WholesomeChoices;
