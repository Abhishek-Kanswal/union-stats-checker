import React from "react";

const UserInfo = ({ user, levelName }) => (
  <div className="flex text-left h-full w-[65%]">
    <div className="mt-6 ml-3 space-y-2 text-[#8C8C8C]">
      <p className="max-w-[200px] font-bold text-2xl leading-6 text-white">
        {user.display_name.toUpperCase()}
      </p>
      <p>
        Lvl {user.level} - {levelName}
      </p>
      <p>Total XP: {user.total_xp}</p>
      <p>
        {user.current_xp} / {user.current_xp + user.xp_required}
      </p>
    </div>
    <div className="ml-[70px] h-full flex items-center text-xl font-bold">
      <p>#{user.rank}</p>
    </div>
  </div>
);

export default UserInfo;
