// YapLeaderboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Duration Mappings
const durationsMap = {
  "7D": "7d",
  "30D": "30d",
  "3M": "3m",
  "6M": "6m",
};

const displayDurations = Object.keys(durationsMap);

// Fetch Top Mindshare Data
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

// Fetch map
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
          const realDuration =
            apiDuration === "3m"
              ? "90d"
              : apiDuration === "6m"
              ? "180d"
              : apiDuration;

          const entries = response.filter(
            (u) =>
              u.S_DURATION === realDuration &&
              u.S_USERNAME?.toLowerCase() === cleanUsername
          );

          const sorted = response
            .filter((d) => d.S_DURATION === apiDuration)
            .sort((a, b) => b.N_MINDSHARE - a.N_MINDSHARE);

          resultMap[displayKey] = {
            rank: entries[0]?.N_RANK ?? null,
            mindshare: entries[0]?.N_MINDSHARE ?? null,
            first: sorted[0]?.N_MINDSHARE ?? null,
            hundredth: sorted[99]?.N_MINDSHARE ?? null,
          };
        }

        setData(resultMap);
      } catch (err) {
        console.error("Fetch error:", err);
        setData({});
      }
    };

    const fetchHundredths = async () => {
      const result = {};
      for (const key of displayDurations) {
        try {
          const res = await firstandHundredthMap[key]();
          result[key] = res.hundredth;
        } catch {
          result[key] = 0;
        }
      }
      setHundredths(result);
    };

    const fetchFirst = async () => {
      const result = {};
      for (const key of displayDurations) {
        try {
          const res = await firstandHundredthMap[key]();
          result[key] = res.first;
        } catch {
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
        {sortedDurations.map((duration, i) => {
          const item = data[duration];

          const rankDisplay = item?.rank != null ? `#${item.rank}` : "🤔";
          const mindshareDisplay =
            item?.mindshare != null
              ? `${(item.mindshare * 100).toFixed(4)}%`
              : "🤔";
          const firstDisplay =
            first[duration] != null ? `${first[duration].toFixed(4)}%` : "-";
          const hundredthDisplay =
            hundredths[duration] != null
              ? `${hundredths[duration].toFixed(4)}%`
              : "-";

          return (
            <tr
              key={duration}
              className={`transition-all ${
                i % 2 === 0 ? "bg-[#1A1A1C]" : "bg-[#1F1F22]"
              } hover:bg-[#27272A]`}
            >
              <td className="py-3 px-4 font-medium text-white text-sm rounded-l-lg">
                {duration}
              </td>
              <td className="py-3 px-4 text-[#4BB7C3] font-semibold text-sm">
                {rankDisplay}
              </td>
              <td className="py-3 px-4 text-white text-sm">{firstDisplay}</td>
              <td className="py-3 px-4 text-[#4BB7C3] font-semibold text-sm">
                {mindshareDisplay}
              </td>
              <td className="py-3 px-4 text-white text-sm rounded-r-lg">
                {hundredthDisplay}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableWrapper>
  );
};

// Table Container
const TableWrapper = ({ children }) => (
  <div className="bg-[#101013] border border-[#27272A] rounded-2xl w-full max-w-[640px] p-5 md:p-6 text-[13px] font-inter shadow-md">
    <div className="overflow-x-auto">
      <table className="w-full text-left table-fixed border-separate border-spacing-y-[10px]">
        <thead>
          <tr className="bg-[#1A1A1C] text-[#9A9AA3] text-sm">
            <th className="py-3 px-4 font-medium text-left rounded-l-lg">
              Time
            </th>
            <th className="py-3 px-4 font-medium text-left">Rank</th>
            <th className="py-3 px-4 font-medium text-left">1st</th>
            <th className="py-3 px-4 font-medium text-left">Mindshare</th>
            <th className="py-3 px-4 font-medium text-left rounded-r-lg">
              100th
            </th>
          </tr>
        </thead>
        {children}
      </table>
    </div>
  </div>
);

// Skeleton Loaders
const SkeletonRow = () => (
  <tr className="bg-[#1F1F22] animate-pulse">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <td key={i} className="py-3 px-4 text-gray-600">
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
