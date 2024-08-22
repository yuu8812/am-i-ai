import React from "react";
import Card from "src/component/Card";

const TextAreaPlaceHolder = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-1 items-center justify-center text-lg">
      <Card>
        <div className="flex flex-1">
          <div className="bg-blue-950 outline-none border-blue-400 w-full h-12 text-red-600 font-bold border px-2 items-center justify-center flex flex-1">
            {message}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TextAreaPlaceHolder;
