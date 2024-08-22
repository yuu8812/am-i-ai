import React, { ReactNode } from "react";

const Card = ({
  children,
  ...props
}: { children: ReactNode } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className="flex flex-1 shadow-lg bg-gray-800 rounded-lg" {...props}>
      <div className="p-2 flex flex-1">{children}</div>
    </div>
  );
};

export default Card;
