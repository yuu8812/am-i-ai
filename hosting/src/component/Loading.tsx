import React from "react";
import { Blocks } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-blue-100">
      <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
};

export default Loading;
