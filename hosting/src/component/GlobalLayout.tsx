import { ReactNode } from "react";

const GlobalLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-1 flex-row">{children}</div>;
};

export default GlobalLayout;
