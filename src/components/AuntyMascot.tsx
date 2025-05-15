
import React from "react";

const AuntyMascot = () => {
  return (
    <div className="relative inline-block">
      <div className="text-6xl md:text-7xl mb-2">👩🏾‍🦱</div>
      <div className="absolute -top-2 -right-2 bg-[#D946EF] text-white text-xs px-2 py-1 rounded-full transform rotate-12 animate-pulse shadow-lg">
        Match Found!
      </div>
      <div className="speech-bubble relative bg-[#E5DEFF] p-3 rounded-lg text-sm font-medium text-[#8B5CF6] mt-2 max-w-xs mx-auto border-2 border-[#D3E4FD] shadow-md">
        "Beta, I found your perfect match!"
        <div className="absolute top-0 left-1/2 -mt-2 transform -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-[#E5DEFF]"></div>
      </div>
    </div>
  );
};

export default AuntyMascot;
