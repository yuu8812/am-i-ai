import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const GlobalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1 flex-row w-screen h-screen">
      <div className="relative z-50 flex flex-1 flex-col">{children}</div>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default GlobalLayout;
