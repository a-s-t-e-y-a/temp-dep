import React, { useState, useEffect } from 'react';

const MarqueeComponent = () => {
  const [news, setNews] = useState([]);

  const mockData = [
    "No Palm Oil",
    "No Cholesterol",
    "No Trans Fat",
    "No White Sugar",
    "High Fiber"
  ];

  useEffect(() => {
    setNews(mockData);
  }, []);

  return (
    <marquee
      behavior="scroll"
      direction="left"
      scrollamount="5"
      className="py-1 lg:text-[20px] md:text-[18px] text-[14px] w-full font-[800]"
    >
      {news.map((item, index) => (
        <span key={index} >
          {item}
          {index < news.length - 1 && <span className="lg:mx-[30px] mx-[20px]">|</span>}
        </span>
      ))}
    </marquee>
  );
};

export default MarqueeComponent;
