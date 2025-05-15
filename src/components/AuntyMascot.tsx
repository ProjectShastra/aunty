
import React from "react";

/**
 * © Copyright 2025 - All Rights Reserved
 * Proprietary and confidential.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
const AuntyMascot = () => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-col items-center">
        {/* Aunty Character - Flat Illustration Style */}
        <div className="w-48 h-48 md:w-56 md:h-56 bg-[#e45964] rounded-lg flex items-center justify-center overflow-hidden relative">
          {/* Aunty Character Illustration */}
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            {/* Purple Sari */}
            <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-[#6d4773] rounded-b-lg"></div>
            <div className="absolute bottom-10 left-2 right-2 h-10 md:h-12 bg-[#8a5c92] transform -rotate-6"></div>
            
            {/* Face */}
            <div className="absolute w-24 h-24 md:w-28 md:h-28 bg-[#c77d56] rounded-full top-0 left-1/2 transform -translate-x-1/2">
              {/* Glasses */}
              <div className="absolute w-20 h-8 md:w-24 md:h-10 top-10 left-1/2 transform -translate-x-1/2">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 border-4 border-[#232323] rounded-full left-0"></div>
                <div className="absolute w-8 h-8 md:w-10 md:h-10 border-4 border-[#232323] rounded-full right-0"></div>
                <div className="absolute w-4 h-1 bg-[#232323] top-4 left-1/2 transform -translate-x-1/2"></div>
              </div>
              
              {/* Eyebrows */}
              <div className="absolute w-5 h-1.5 bg-[#232323] rounded-full top-8 left-5 transform -rotate-12"></div>
              <div className="absolute w-5 h-1.5 bg-[#232323] rounded-full top-8 right-5 transform rotate-12"></div>
              
              {/* Smile */}
              <div className="absolute w-10 h-6 border-b-4 border-[#8a4a39] rounded-b-full bottom-4 left-1/2 transform -translate-x-1/2"></div>
              
              {/* Bindi */}
              <div className="absolute w-2.5 h-2.5 bg-[#8a4a39] rounded-full top-8 left-1/2 transform -translate-x-1/2"></div>
            </div>
            
            {/* Gray Hair */}
            <div className="absolute w-28 h-20 md:w-32 md:h-24 bg-[#b0b0b0] top-0 left-1/2 transform -translate-x-1/2 rounded-t-full overflow-hidden">
              <div className="absolute w-10 h-10 bg-[#c8c8c8] rounded-full left-3 top-2"></div>
              <div className="absolute w-10 h-10 bg-[#c8c8c8] rounded-full right-3 top-2"></div>
            </div>
            
            {/* Earrings */}
            <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-[#f0c154] rounded-full top-16 left-1"></div>
            <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-[#f0c154] rounded-full top-16 right-1"></div>
            
            {/* Necklace */}
            <div className="absolute w-20 h-2.5 bg-[#f0c154] rounded-full top-28 left-1/2 transform -translate-x-1/2"></div>
            
            {/* Left Hand with Bracelet */}
            <div className="absolute w-10 h-14 bg-[#c77d56] rounded-lg bottom-16 left-0 transform rotate-12">
              <div className="absolute w-8 h-3 bg-[#f0c154] rounded-full top-10 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute w-5 h-8 bg-[#c77d56] rounded-full top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            
            {/* Right Hand with Phone */}
            <div className="absolute w-10 h-14 bg-[#c77d56] rounded-lg bottom-10 right-2">
              <div className="absolute w-8 h-3 bg-[#f0c154] rounded-full top-10 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute w-8 h-14 bg-[#2e1e2e] rounded-lg top-0 left-4 transform -rotate-12">
                <div className="absolute w-4 h-4 bg-[#faf3eb] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text under mascot */}
        <div className="mt-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#faf3eb] font-sans tracking-wide">
            AUNTIE
          </h2>
          <p className="text-sm md:text-base text-[#faf3eb] font-medium mt-2 px-2 max-w-xs leading-snug">
            Modern Love. Ancient Wisdom.<br />Powered by Your Favorite Nosy Auntie.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuntyMascot;
