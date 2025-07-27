import React from "react";

const Unionstats = () => {
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
    <>
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
                    (searchRank[0].current_xp + searchRank[0].xp_required)) *
                  100
                }
                className="w-full bg-[#27272A] [&>div]:bg-[#4BB7C3] mx-9"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Unionstats;
