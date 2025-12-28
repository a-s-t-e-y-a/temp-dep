import React from 'react';
import MarqueeComponent from '../../components/MarqueeComponent/MarqueeComponent';

const Header = () => {
  
  return (
    <div className="w-full lg:h-[45px] md:h-[45px] h-[30px] bg-[#071437] text-[#FECC0B] flex items-center justify-center text-center overflow-hidden">
      
       <MarqueeComponent />
      
    </div>
  );
};

export default Header;