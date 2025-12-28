import React from 'react';
import { assets } from '../../assets/assets';

export default function Squares() {
  const items = [
    { src: assets.Group481, alt: 'Trans Fat Free' },
    { src: assets.Group482, alt: 'Palm Oil Free' },
    { src: assets.Group483, alt: 'No Cholesterol' },
    { src: assets.Group486, alt: 'Tea Time Snack' },
    { src: assets.Group522, alt: 'High Fiber' },
    { src: assets.Group523, alt: 'No White Sugar' },
  ];

  return (
    <section className="w-full py-0 lg:py-6 lg:my-8">
      <div className="flex flex-wrap justify-center px-4 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-1/3 md:w-1/6 flex justify-center items-center lg:mb-4 md:mb-4 mb-2"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-full w-[70px] md:w-[90px] lg:w-[110px] object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
