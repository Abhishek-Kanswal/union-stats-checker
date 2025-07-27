import React, { useEffect, useState } from "react";
import axios from "axios";

// Map for API durations
const durationsMap = {
  "7D": "7d",
  "30D": "30d",
  "3M": "3m",
  "6M": "6m",
};

const displayDurations = Object.keys(durationsMap);

// Fetch mindshare for 1st and 100th ranks from Kaito API
const getMindshareData = async (duration) => {
  const smallDuration = duration.toLowerCase();
  try {
    const res = await axios.get(
      `https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=${smallDuration}&topic_id=UNION&top_n=100&customized_community=customized&community_yaps=true`
    );
    const result = res.data || [];
    const first = (result[0]?.mindshare ?? 0) * 100;
    const hundredth = (result[99]?.mindshare ?? 0) * 100;
    return { first, hundredth };
  } catch (err) {
    return { first: 0, hundredth: 0 };
  }
};

// Create a map of fetch functions for each display duration
const firstandHundredthMap = {
  "7D": () => getMindshareData("7d"),
  "30D": () => getMindshareData("30d"),
  "3M": () => getMindshareData("3m"),
  "6M": () => getMindshareData("6m"),
};

// Main Component
const YapLeaderboard = ({ username }) => {
  const [data, setData] = useState(null);
  const [hundredths, setHundredths] = useState({});
  const [first, setFirst] = useState({});

  useEffect(() => {
    if (!username) return;

    const cleanUsername = username.replace(/^@/, "").toLowerCase();

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/kaito?username=${cleanUsername}`);
        const response = res.data || [];
        const resultMap = {};

        for (const displayKey of displayDurations) {
          const apiDuration = durationsMap[displayKey];
          let realDuration = "";
          if (apiDuration === "7d") realDuration = "7d";
          else if (apiDuration === "30d") realDuration = "30d";
          else if (apiDuration === "3m") realDuration = "90d";
          else if (apiDuration === "6m") realDuration = "180d";
          const entries = response.filter(
            (u) =>
              u.S_DURATION === realDuration &&
              u.S_USERNAME?.toLowerCase() === cleanUsername
          );
          const sorted = response
            .filter((d) => d.S_DURATION === apiDuration)
            .sort((a, b) => b.N_MINDSHARE - a.N_MINDSHARE);

          const first = sorted[0]?.N_MINDSHARE ?? null;
          const hundredth = sorted[99]?.N_MINDSHARE ?? null;

          resultMap[displayKey] = {
            rank: entries[0]?.N_RANK ?? null,
            mindshare: entries[0]?.N_MINDSHARE ?? null,
            first,
            hundredth,
          };
        }

        setData(resultMap);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setData({});
      }
    };

    const fetchHundredths = async () => {
      const result = {};
      for (const key of Object.keys(durationsMap)) {
        try {
          const res = await firstandHundredthMap[key]();
          result[key] = res.hundredth;
        } catch (e) {
          result[key] = 0;
        }
      }
      setHundredths(result);
    };

    const fetchFirst = async () => {
      const result = {};
      for (const key of Object.keys(durationsMap)) {
        try {
          const res = await firstandHundredthMap[key]();
          result[key] = res.first;
        } catch (e) {
          result[key] = 0;
        }
      }
      setFirst(result);
    };

    fetchData();
    fetchFirst();
    fetchHundredths();
  }, [username]);

  if (data === null) {
    return (
      <TableWrapper>
        <SkeletonRows />
      </TableWrapper>
    );
  }

  if (!Object.keys(data).length) return null;

  const sortedDurations = displayDurations.sort((a, b) => {
    const aRanked = data[a]?.rank != null;
    const bRanked = data[b]?.rank != null;
    return aRanked === bRanked ? 0 : aRanked ? -1 : 1;
  });

  return (
    <TableWrapper>
      <tbody>
        {sortedDurations.map((duration, index) => {
          const item = data[duration];

          const rankDisplay = item?.rank != null ? `#${item.rank}` : "🤔";
          const mindshareDisplay =
            item?.mindshare != null
              ? `${(item.mindshare * 100).toFixed(4)}%`
              : "🤔";
          const firstDisplay =
            first[duration] != null
              ? `${first[duration].toFixed(4)}%`
              : "-";
          const hundredthDisplay =
            hundredths[duration] != null
              ? `${hundredths[duration].toFixed(4)}%`
              : "-";

          return (
            <tr
              key={duration}
              className={index % 2 === 0 ? "bg-[#18181B]" : "bg-[#27272A]"}
            >
              <td className="py-2 px-3 rounded-l-md text-white">{duration}</td>
              <td className="text-orange-300 font-semibold">{rankDisplay}</td>
              <td className="text-white">{firstDisplay}</td>
              <td className="font-semibold text-orange-300">
                {mindshareDisplay}
              </td>
              <td className="py-2 px-3 rounded-r-md text-white">
                {hundredthDisplay}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableWrapper>
  );
};

// Wrapper Layout
const TableWrapper = ({ children }) => (
  <div className="bg-[#101013]/80 rounded-lg w-full max-w-[600px] p-4 border border-[#27272A] text-white text-[13px] leading-[1.6] font-medium tracking-wide">
    <div className="overflow-x-auto">
      <table className="w-full text-left table-fixed border-separate border-spacing-y-[8px]">
        <thead>
          <tr className="text-gray-400 bg-[#18181B]">
            <th className="py-2 px-3">Time</th>
            <th className="py-2 px-3">Rank</th>
            <th className="py-2 px-3">1st</th>
            <th className="py-2 px-3">Mind</th>
            <th className="py-2 px-3">100th</th>
          </tr>
        </thead>
        {children}
      </table>
    </div>
  </div>
);

// Loading Skeleton Rows
const SkeletonRow = () => (
  <tr className="bg-[#18181B] animate-pulse">
    {Array(5)
      .fill(null)
      .map((_, i) => (
        <td key={i} className="py-2 px-3 text-white">
          ----
        </td>
      ))}
  </tr>
);

const SkeletonRows = () => (
  <tbody>
    {displayDurations.map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </tbody>
);

export default YapLeaderboard;
