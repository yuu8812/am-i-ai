import React from "react";

const OnlineBadge = ({ isOnline }: { isOnline: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs">{isOnline ? "Online" : "Offline"}</div>
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};

export default OnlineBadge;
