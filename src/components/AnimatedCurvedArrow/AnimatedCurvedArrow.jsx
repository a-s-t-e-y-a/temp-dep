import React, { useEffect, useState, useRef } from 'react';

const AnimatedCurvedArrow = () => {
  const [dashes, setDashes] = useState([]);
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  const animateArrow = () => {
    const path = pathRef.current;
    const dashCount = 35;
    const dashesArray = [];

    const length = path.getTotalLength();

    for (let i = 0; i < dashCount; i++) {
      const start = (i / dashCount) * length;
      const end = ((i + 0.5) / dashCount) * length;

      const p1 = path.getPointAtLength(start);
      const p2 = path.getPointAtLength(end);

      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

      dashesArray.push({
        x: p1.x,
        y: p1.y,
        angle,
        i,
      });
    }

    setDashes([]); // reset first
    setTimeout(() => {
      setDashes(dashesArray);
    }, 50);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateArrow();
        }
      },
      { threshold: 0.3 } // Adjust if needed
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef}>
      <svg viewBox="0 0 400 150" className="lg:w-[430px] md:w-[300px] w-[150px]">
        <style>{`
          .dash {
            stroke: black;
            stroke-width: 3;
            opacity: 0;
            animation: appear 0.08s forwards;
          }
          @keyframes appear {
            to {
              opacity: 1;
            }
          }
        `}</style>

        <g transform="rotate(12, 200, 75) scale(1, -1) translate(0, -140)">
          <path
            ref={pathRef}
            d="M0,90 C100,-180 280,250 390,70"
            fill="none"
            stroke="transparent"
          />

          {dashes.map(({ x, y, angle, i }) => (
            <line
              key={i}
              x1={-4}
              y1={0}
              x2={4}
              y2={0}
              transform={`translate(${x}, ${y}) rotate(${angle})`}
              className="dash"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}

          {dashes.length > 0 && (() => {
            const last = dashes[dashes.length - 1];
            return (
              <g
                transform={`translate(${last.x}, ${last.y}) rotate(${last.angle})`}
                style={{
                  opacity: 0,
                  animation: 'appear 0.08s forwards',
                  animationDelay: `${dashes.length * 0.08}s`,
                }}
              >
                <polyline
                  points="0,-5 10,0 0,5"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                />
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedCurvedArrow;
