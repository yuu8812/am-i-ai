import React, { forwardRef, RefObject } from "react";
import Card from "src/component/Card";

type TextAreaProps = {
  inputRef: RefObject<HTMLInputElement>;
};

const TextArea = forwardRef<HTMLInputElement, TextAreaProps>(({}, ref) => {
  return (
    <div className="flex flex-1 items-center justify-center text-lg">
      <Card>
        <div className="flex flex-1">
          <input
            ref={ref}
            className="bg-blue-950 outline-none border-blue-400 w-full h-12 text-white border px-2"
          />
        </div>
      </Card>
    </div>
  );
});

export default TextArea;
