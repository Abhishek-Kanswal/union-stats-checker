import React, { useState } from "react";
import { Progress } from "./components/ui/progress";
import YapperInfo from "./components/YapperInfo";
import SkeletonCard from "./components/SkeletonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import YapperSearchBar from "./components/ui/YapperSearchBar";
import unisonXkiato from "./assets/unionxkaito.png";

function App() {
  const [username, setUsername] = useState("");

  const cleanUsername = username.replace(/^@/, "");

  return (
    <div className="bg-[#09090B] min-h-screen text-white font-geist px-4 py-10 relative">
      {/* Centered section */}
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center mt-16">
        <img src={unisonXkiato} className="w-[600px]" />
        <p className="text-[20px]  text-[#9A9AA3] text-center tracking-tight mt-2">
          Search your username and view your rank in real time.
        </p>

        {/* Styled container */}
        <div className="w-full max-w-5xl min-h-[450px] rounded-xl border border-[#333] p-6 md:p-8 flex flex-col shadow-lg mt-10 bg-[#101013]">
          {/* Username at top of the card */}
          <div className="h-[40px] mb-6 mx-3 w-full">
            {cleanUsername && (
              <div className="text-3xl font-bold text-white">
                {cleanUsername.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between h-full">
            {/* Left: Avatar */}
            <div className="w-[335px] h-[335px] bg-black/60 rounded-lg flex items-center justify-center overflow-hidden">
              {cleanUsername ? (
                <img
                  src={`https://unavatar.io/x/${cleanUsername}`}
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-lg"
                  loading="eager"
                />
              ) : (
                <div className="text-gray-500">No user</div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex-1 mt-6 md:mt-0 md:ml-8 text-center md:text-left h-full">
              <YapperInfo username={username} />
            </div>
          </div>
        </div>

        <div className="w-[70%] max-w-5xl mt-6">
          <YapperSearchBar onSearch={(value) => setUsername(value)} />
        </div>
      </div>

      {/* Bottom-right social icons */}
      <div className="fixed bottom-5 right-5 flex space-x-4">
        <a
          href="https://x.com/ImmyGlow"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-[#4BB7C3] transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faXTwitter} size="2x" />
        </a>
        <a
          href="https://github.com/Abhishek-Kanswal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-[#4BB7C3] transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>
    </div>
  );
}

export default App;
