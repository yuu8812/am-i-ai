import React from "react";
import { MdOutlineSentimentSatisfied } from "react-icons/md";

const MultiIcon = () => {
  return (
    <div className="flex w-5">
      <div className="relative">
        <MdOutlineSentimentSatisfied size={16} />
      </div>
      <div className="relative -left-1">
        <MdOutlineSentimentSatisfied size={16} />
      </div>
    </div>
  );
};

export default MultiIcon;
