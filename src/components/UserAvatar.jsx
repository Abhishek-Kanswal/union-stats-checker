import React from "react";

const UserAvatar = ({ displayName }) => (
  <div className="flex items-center justify-center h-full w-[35%]">
    <div
      className="border border-[#3F3F47] w-[130px] h-[130px] rounded-full bg-cover bg-center bg-gray-800"
      style={{
        backgroundImage: `url(https://unavatar.io/twitter/${displayName})`,
      }}
    ></div>
  </div>
);

export default UserAvatar;
