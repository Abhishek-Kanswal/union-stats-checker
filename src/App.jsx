import React, { useState } from "react";
import { Card } from "./components/Card";
import { Progress } from "./components/ui/progress";
import YapperInfo from "./components/YapperInfo";
import SkeletonCard from "./components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import unionLogo from "./assets/union-logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

function App() {
  const API_KEY = import.meta.env.VITE_UNION_API_KEY;
  const [searchName, setSearchName] = useState("");
  const [searchRank, setSearchRank] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showYapperInfo, setShowYapperInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const url = `https://api.dashboard.union.build/rest/v1/user_levels?select=*&display_name=ilike.*${encodeURIComponent(
    searchName
  )}*&order=total_xp.desc,user_id.asc`;

  const fetchData = async () => {
    if (!searchName.trim()) return alert("Please enter a username");
    setHasSearched(true);
    setLoading(true);
    setShowYapperInfo(false);
    setSearchRank(null);

    try {
      const response = await fetch(url, {
        headers: {
          apikey: API_KEY,
        },
      });
      const data = await response.json();
      setSearchRank(data);
      setShowYapperInfo(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchRank(null);
    }
    setLoading(false);
  };

  const level = {
    1: "Conscript",
    2: "Private First Class",
    3: "Junior Sergeant",
    4: "Sergeant",
    5: "Senior Sergeant",
    6: "Starshina",
    7: "Junior Lieutenant",
    8: "Lieutenant",
    9: "Senior Lieutenant",
    10: "Junior Captain",
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-geist px-4 py-10 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
          Union Stats Checker
        </h1>
        <p className="text-sm text-gray-400 text-center max-w-md">
          Search your Testnet username and view XP, rank, and progress in
          real-time.
        </p>
        <Card>
          {(!hasSearched || loading) && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkeletonCard />
            </motion.div>
          )}
          <AnimatePresence>
            {searchRank?.[0] && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-[#101013] border border-[#27272A] rounded-md h-[200px] w-[600px]"
              >
                <div className="flex w-full mt-2">
                  <div className="flex items-center justify-center h-full w-[35%]">
                    <div
                      className="border border-[#3F3F47] w-[130px] h-[130px] rounded-full bg-cover bg-center bg-gray-800"
                      style={{
                        backgroundImage: `url(https://unavatar.io/twitter/${searchRank[0].display_name})`,
                      }}
                    ></div>
                  </div>
                  <div className="flex text-left h-full w-[65%]">
                    <div className="mt-6 ml-3 space-y-2 text-[#8C8C8C]">
                      <p className=" max-w-[200px] font-bold text-2xl leading-6 text-white">
                        {searchRank[0].display_name.toUpperCase()}
                      </p>
                      <p>
                        Lvl {searchRank[0].level} -{" "}
                        {level[searchRank[0].level] || "Unknown"}
                      </p>
                      <p>Total XP: {searchRank[0].total_xp}</p>
                      <p>
                        {searchRank[0].current_xp} /{" "}
                        {searchRank[0].current_xp + searchRank[0].xp_required}
                      </p>
                    </div>
                    <div className="ml-[70px] h-full flex items-center text-xl font-bold">
                      <p>#{searchRank[0].rank}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center h-[15%] w-full mt-2">
                  <Progress
                    value={
                      (searchRank[0].current_xp /
                        (searchRank[0].current_xp +
                          searchRank[0].xp_required)) *
                      100
                    }
                    className="w-full bg-[#27272A] [&>div]:bg-[#4BB7C3] mx-9"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showYapperInfo && !loading && hasSearched && searchRank?.[0] && (
            <YapperInfo username={searchName} />
          )}

          <div className="flex items-center h-10 w-full border border-gray-600 rounded-lg mt-4 focus-within:border-[#4BB7C3]">
            <input
              onChange={(e) => setSearchName(e.target.value.replace(/^@/, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchData();
              }}
              type="text"
              placeholder="Type X username like @ImmyGlow"
              className="bg-transparent outline-none h-full w-[82%] text-white flex items-center ml-5"
            />
            <button
              onClick={fetchData}
              className="w-[18%] rounded-lg h-[90%] my-auto bg-white text-black flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                "Done"
              )}
            </button>
          </div>

          {hasSearched && searchRank?.length === 0 && !loading && (
            <div className="text-red-500 h-2 w-full text-left ml-5 mt-2">
              Username has not participated in Union Testnet.
            </div>
          )}
        </Card>
      </div>

      {/* Bottom-right fixed icons */}
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
