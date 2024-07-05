import React from "react";

const TitleArea = ({ title }: { title: string }) => {
  return (
    <div className="flex my-2">
      <div className="text-xl font-semibold">{title}</div>
    </div>
  );
};

export default TitleArea;
