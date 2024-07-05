import React from "react";
import Transition from "src/animate/Transition";
import Button from "src/component/Button";
import TitleArea from "src/component/TitleArea";

const Solo = () => {
  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Solo Game" />
      <Transition>
        <div className="flex flex-1 items-center justify-center">
          <div className="">
            <Button message="Start a new game" />
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Solo;
