
import React from "react";

/**
 * © Copyright 2025 - All Rights Reserved
 * Proprietary and confidential.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
const AuntyMascot = () => {
  return (
    <div className="relative inline-block">
      <div className="mb-2">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-pink-300">
            <div className="text-center">
              <span className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text font-serif tracking-wide">
                Aunty
              </span>
              <div className="text-xs text-pink-500 font-medium -mt-1">MATCHMAKER</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full transform rotate-12 shadow-lg">
        New Match!
      </div>
      <div className="speech-bubble relative bg-purple-100 p-4 rounded-xl text-sm font-medium text-purple-800 mt-3 max-w-xs mx-auto border border-purple-200 shadow-md">
        "Let me find your perfect match!"
        <div className="absolute top-0 left-1/2 -mt-2 transform -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-purple-100"></div>
      </div>
    </div>
  );
};

export default AuntyMascot;
