import React from "react";
import "src/style/robot.css"; // 外部スタイルシートを使用

const Robot: React.FC = () => {
  return (
    <div>
      <div className="robot">
        {/* 頭 */}
        <div className="head">
          <div className="eyes">
            <div className="eye left-eye"></div>
            <div className="eye right-eye"></div>
          </div>
          <div className="antenna"></div>
        </div>
        {/* 体 */}
        <div className="body">
          <div className="left-arm"></div>
          <div className="right-arm"></div>
          <div className="legs"></div>
        </div>
      </div>
    </div>
  );
};

export default Robot;
