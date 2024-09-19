import React from "react";
import Button from "src/component/Button";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex items-center flex-1 justify-center bg-gray-900 text-white">
      <div className="flex items-center justify-center flex-col">
        {/* ロゴやアイコン */}
        <div className="unauthorized-icon mx-auto mb-4">
          <svg
            className="w-24 h-24 text-red-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            ></path>
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-100">Access Denied</h1>
        <div className="h-10"></div>
        {/* 説明文 */}
        <p className="text-gray-400 mb-6">
          You don't have permission to view this page. Please make sure you have
          the correct credentials.
        </p>

        {/* 戻るボタン */}
        <div className="w-80">
          <Button message="Go Back to Home" />
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
