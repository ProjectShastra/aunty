
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
        {/* Aunty Character - Simplified Modern Style */}
        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#FFD1DC] rounded-full flex items-center justify-center overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Face */}
            <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-amber-200 rounded-full top-4 md:top-5">
              {/* Eyes */}
              <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-900 rounded-full top-8 md:top-10 left-1/2 transform -translate-x-5 md:-translate-x-6"></div>
              <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-gray-900 rounded-full top-8 md:top-10 left-1/2 transform translate-x-3 md:translate-x-4"></div>
              
              {/* Smile */}
              <div className="absolute w-8 h-4 border-b-2 border-gray-800 rounded-b-full bottom-6 left-1/2 transform -translate-x-1/2"></div>
              
              {/* Bindi */}
              <div className="absolute w-1.5 h-1.5 bg-red-600 rounded-full top-5 left-1/2 transform -translate-x-1/2"></div>
            </div>
            
            {/* Hair */}
            <div className="absolute w-26 h-14 md:w-28 md:h-16 bg-gray-800 rounded-t-full top-0 overflow-hidden">
            </div>
            
            {/* Sari accent */}
            <div className="absolute bottom-0 w-full h-1/3 bg-[#9B6BFB] rounded-b-full"></div>
          </div>
        </div>
        
        {/* Text under mascot */}
        <div className="mt-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#9B6BFB] font-sans tracking-tight">AUNTY</h2>
          <p className="text-sm md:text-base text-gray-600 font-medium mt-1 px-2 max-w-xs">
            Modern Love. Ancient Wisdom.
          </p>
        </div>
      </div>
      
      {/* Speech bubble */}
      <div className="speech-bubble relative bg-white p-3 rounded-lg text-sm font-medium text-gray-700 mt-3 max-w-xs mx-auto border border-gray-200 shadow-sm">
        "Let me find you the perfect match, beta!"
        <div className="absolute top-0 left-1/2 -mt-2 transform -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-white"></div>
      </div>
      
      {/* New Match indicator */}
      <div className="absolute -top-2 -right-2 bg-[#9B6BFB] text-white text-xs px-2 py-1 rounded-full shadow-sm">
        Matchmaking!
      </div>
    </div>
  );
};

export default AuntyMascot;
