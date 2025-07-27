import React, { useState } from "react";
import { Progress } from "./components/ui/progress";
import YapperInfo from "./components/YapperInfo";
import SkeletonCard from "./components/SkeletonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import YapperSearchBar from "./components/ui/YapperSearchBar";
import bg from "./assets/background.webp";

function App() {
  const [username, setUsername] = useState("");

  const cleanUsername = username.replace(/^@/, "");

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen text-white font-geist px-4 py-10 relative"
    >
      {/* Centered section */}
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center mt-16">
        <img src="src/assets/unionxkaito.png" className="w-[400px]" />
        <p className="text-[20px]  text-[#B19979] text-center tracking-tight mt-2">
          Search your username and view yourrank in real time.
        </p>

        {/* Styled container */}
        <div className="w-full max-w-5xl min-h-[450px] rounded-xl border border-[#333] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg mt-10 [background:linear-gradient(to_bottom_right,_#1d1c1c_40%,_rgba(255,163,80,0.1)_100%)]">
          {/* Left: Fast loading image */}
          <div className="w-[350px] h-[350px] bg-black/60 rounded-lg border border-[#444] flex items-center justify-center overflow-hidden">
            {cleanUsername ? (
              <img
                src={`https://unavatar.io/x/${cleanUsername}?s=512`}
                alt="User avatar"
                className="w-full h-full object-cover rounded-lg"
                loading="eager"
              />
            ) : (
              <div className="text-gray-500">No user</div>
            )}
          </div>

          {/* Right: Info + Search */}
          <div className="flex-1 mt-6 md:mt-0 md:ml-8 text-center md:text-left h-full">
            <YapperInfo username={username} />
            <YapperSearchBar onSearch={(value) => setUsername(value)} />
          </div>
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
