import React, { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1 shadow rounded border">
      <div className="p-2 flex flex-1">{children}</div>
    </div>
  );
};

export default Card;
