import React from 'react';
import { assets } from '../../assets/assets';

function AdBanner() {
  return (
    <div className="w-full banner-glare-hover text-center">
      <img
        src={"https://d11a0m43ek7ap8.cloudfront.net/search_banner_update_1.png"}
        alt="AdBanner"
        className="inline-block max-w-full object-cover rounded-2xl"
      />
    </div>
  );
}

export default AdBanner;