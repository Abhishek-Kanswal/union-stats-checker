import React from "react";
import { Progress } from "./ui/progress";

const ProgressBar = ({ currentXp, requiredXp }) => (
  <div className="flex items-center justify-center h-[15%] w-full mt-2">
    <Progress
      value={(currentXp / (currentXp + requiredXp)) * 100}
      className="w-full bg-[#27272A] [&>div]:bg-[#4BB7C3] mx-9"
    />
  </div>
);

export default ProgressBar;
