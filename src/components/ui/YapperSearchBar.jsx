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
    <div className="relative w-full mx-6 mt-4 mx-auto">
      <input
        type="text"
        placeholder="Search yappers..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-4 pr-10 py-2 rounded-md 
                   bg-white/10 text-white placeholder-white/60 
                   border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
      >
        <FontAwesomeIcon icon={faSearch} className="text-white/70" />
      </button>
    </div>
  );
};

export default YapperSearchBar;
