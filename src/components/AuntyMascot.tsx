
import React from "react";

const AuntyMascot = () => {
  return (
    <div className="relative inline-block">
      <div className="text-6xl md:text-7xl mb-2">👵🏾</div>
      <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full transform rotate-12 animate-pulse">
        Match Found!
      </div>
      <div className="speech-bubble relative bg-purple-100 p-3 rounded-lg text-sm font-medium text-purple-800 mt-2 max-w-xs mx-auto">
        "Beta, I found your perfect match!"
        <div className="absolute top-0 left-1/2 -mt-2 transform -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-purple-100"></div>
      </div>
    </div>
  );
};

export default AuntyMascot;
