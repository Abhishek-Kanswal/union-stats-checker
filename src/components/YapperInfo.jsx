import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const durations = ["7d", "30d", "3m", "6m", "12m"];

const SkeletonRow = () => (
  <tr className="bg-[#18181B] animate-pulse">
    <td className="py-2 px-3 rounded-l-md text-white">----</td>
    <td className="text-[#4BB7C3] font-semibold">--</td>
    <td className="text-white">----</td>
    <td className="font-semibold text-[#4BB7C3]">----</td>
    <td className="py-2 px-3 rounded-r-md text-white">----</td>
  </tr>
);

const YapLeaderbaord = ({ username }) => {
  const [data, setData] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    if (!username) return;

    const lowerUsername = username.toLowerCase();

    // Try cache first
    const cachedLocal = localStorage.getItem(`kaito-${lowerUsername}`);
    if (cachedLocal) {
      const parsed = JSON.parse(cachedLocal);
      if (Object.keys(parsed).length > 0) {
        setData(parsed);
        return;
      }
    }

    const fetchData = async () => {
      const resultMap = {};

      const results = await Promise.allSettled(
        durations.map(async (duration) => {
          try {
            const res = await axios.get(`/api/kaito?duration=${duration}`);
            const users = res.data;

            const user = users.find(
              (u) => u.username.toLowerCase() === lowerUsername
            );
            if (!user) return null;

            return {
              duration,
              user: {
                ...user,
                first: users[0]?.mindshare ?? null,
                hundredth: users[99]?.mindshare ?? null,
              },
            };
          } catch {
            return null;
          }
        })
      );

      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value) {
          resultMap[r.value.duration] = r.value.user;
        }
      });

      if (Object.keys(resultMap).length === 0) {
        setData({});
        return;
      }

      cache.current[lowerUsername] = resultMap;
      localStorage.setItem(`kaito-${lowerUsername}`, JSON.stringify(resultMap));
      setData(resultMap);
    };

    fetchData();
  }, [username]);

  if (data === null) {
    return (
      <div className="bg-[#101013] rounded-lg w-full max-w-[600px] p-4 border border-[#27272A] text-white text-[13px] leading-[1.6] font-medium tracking-wide">
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
            <tbody>
              {durations.map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // If user not found in any duration
  if (!Object.keys(data).length) return null;

  return (
    <div className="bg-[#101013] rounded-lg w-full max-w-[600px] p-4 border border-[#27272A] text-white text-[13px] leading-[1.6] font-medium tracking-wide">
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
          <tbody>
            {Object.entries(data).map(([duration, user], index) => (
              <tr
                key={duration}
                className={index % 2 === 0 ? "bg-[#18181B]" : "bg-[#27272A]"}
              >
                <td className="py-2 px-3 rounded-l-md text-white">
                  {duration.toUpperCase()}
                </td>
                <td className="text-[#4BB7C3] font-semibold">#{user.rank}</td>
                <td className="text-white">
                  {user.first ? (user.first * 100).toFixed(4) + "%" : "-"}
                </td>
                <td className="font-semibold text-[#4BB7C3]">
                  {parseFloat(user.mindshare).toFixed(4)}
                </td>
                <td className="py-2 px-3 rounded-r-md text-white">
                  {user.hundredth
                    ? (user.hundredth * 100).toFixed(4) + "%"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YapLeaderbaord;
