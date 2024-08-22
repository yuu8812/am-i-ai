import React from "react";

const Box = ({
  message,
  title,
  width = "w-full",
  height = "h-40",
}: {
  message: string;
  title: string;
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className={`bg-gray-800 text-white p-4 rounded-lg shadow-lg ${width} ${height}`}
    >
      <h2 className="text-lg font-semibold text-gray-400">{title}</h2>
      <p className="text-3xl font-bold text-blue-500 mt-2">{message}</p>
    </div>
  );
};

export default Box;
