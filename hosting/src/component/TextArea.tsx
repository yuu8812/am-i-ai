import React, { forwardRef, RefObject } from "react";
import Card from "src/component/Card";

type TextAreaProps = {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
};

const TextArea = forwardRef<HTMLInputElement, TextAreaProps>(
  ({ value, onChange, editable = true }, ref) => {
    return (
      <div className="flex flex-1 items-center justify-center text-lg z-10 relative">
        <Card>
          <div className="flex flex-1">
            <input
              ref={ref}
              className="bg-blue-950 outline-none border-blue-400 w-full h-12 text-white border px-4"
              value={value}
              onChange={onChange}
              disabled={!editable}
            />
          </div>
        </Card>
      </div>
    );
  }
);

export default TextArea;
