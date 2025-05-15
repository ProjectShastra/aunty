
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
        {/* Aunty Character - Illustrated Style */}
        <div className="w-36 h-36 md:w-48 md:h-48 bg-pink-500 rounded-full flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Sari/Outfit - Purple */}
            <div className="absolute bottom-0 w-full h-1/2 bg-purple-800 rounded-b-full"></div>
            
            {/* Face */}
            <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-amber-700 rounded-full top-6 md:top-8">
              {/* Glasses */}
              <div className="absolute w-16 md:w-20 h-4 border-2 border-gray-900 rounded-full top-8 md:top-10 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-gray-900 rounded-full top-8 md:top-10 left-1/2 transform -translate-x-5 md:-translate-x-7"></div>
              <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-gray-900 rounded-full top-8 md:top-10 left-1/2 transform translate-x-2 md:translate-x-3"></div>
              
              {/* Smile */}
              <div className="absolute w-10 h-5 border-b-2 border-gray-900 rounded-b-full bottom-4 left-1/2 transform -translate-x-1/2"></div>
              
              {/* Bindi */}
              <div className="absolute w-1.5 h-1.5 bg-red-700 rounded-full top-6 left-1/2 transform -translate-x-1/2"></div>
            </div>
            
            {/* Hair */}
            <div className="absolute w-24 h-16 md:w-28 md:h-20 bg-gray-300 rounded-t-full top-0 overflow-hidden">
              <div className="absolute w-6 h-10 bg-gray-400 rounded-full -top-2 left-3"></div>
              <div className="absolute w-6 h-10 bg-gray-400 rounded-full -top-1 right-3"></div>
              <div className="absolute w-8 h-8 bg-gray-400 rounded-full top-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
            
            {/* Gold Jewelry - Earrings */}
            <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-16 md:top-20 left-5 md:left-8 shadow-md"></div>
            <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-16 md:top-20 right-5 md:right-8 shadow-md"></div>
            
            {/* Gold Necklace */}
            <div className="absolute w-12 h-1 bg-yellow-500 rounded-full top-20 md:top-24 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
        
        {/* Text under mascot */}
        <div className="mt-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-500 font-serif tracking-wider">AUNTY</h2>
          <p className="text-sm md:text-base text-pink-600 font-medium mt-1 px-2 max-w-xs">
            Modern Love. Ancient Wisdom.
          </p>
        </div>
      </div>
      
      {/* Speech bubble */}
      <div className="speech-bubble relative bg-white p-3 rounded-xl text-sm font-medium text-pink-700 mt-3 max-w-xs mx-auto border-2 border-pink-300 shadow-md">
        "Let me find you the perfect match, beta!"
        <div className="absolute top-0 left-1/2 -mt-2 transform -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-white"></div>
      </div>
      
      {/* New Match indicator */}
      <div className="absolute -top-2 -right-2 bg-yellow-500 text-purple-900 text-xs px-2 py-1 rounded-full transform rotate-12 shadow-lg border border-yellow-600">
        Matchmaking!
      </div>
    </div>
  );
};

export default AuntyMascot;
