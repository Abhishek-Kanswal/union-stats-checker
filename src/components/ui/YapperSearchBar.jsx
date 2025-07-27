import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const YapperSearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search yappers..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-5 pr-12 py-3 text-base rounded-xl 
                   bg-[#101013] text-white placeholder-white/60 
                   border border-[#27272A] focus:outline-none 
                   focus:ring-2 focus:ring-[#27272A] transition-all duration-200"
      />
      <button
        onClick={handleSearch}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
      >
        <FontAwesomeIcon icon={faSearch} className="text-white/70 text-lg" />
      </button>
    </div>
  );
};

export default YapperSearchBar;
