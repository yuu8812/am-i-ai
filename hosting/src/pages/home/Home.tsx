import React from "react";
import { Link } from "react-router-dom";
import Transition from "src/animate/Transition";
import Card from "src/component/Card";
import TitleArea from "src/component/TitleArea";

const Home = () => {
  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Home" />
      <Transition>
        <div className="pt-2"></div>
        <div className="flex flex-1 gap-2">
          <Card>
            <div className="flex flex-col flex-1">
              <div className="underline">New game!!</div>
              <div className="text-sm pt-2 text-gray-400">
                Start a new game and test your AI detection skills
              </div>
              <div className="flex gap-10 flex-1 items-center justify-center">
                <Link
                  to={`game/solo`}
                  className="relative w-60 h-24 shadow-lg text-sm rounded flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600 text-white font-bold hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0 group-hover:translate-y-0 ease-in-out">
                    🎮
                    <span className="pr-2" />
                    Solo player mode
                  </span>
                </Link>
                <Link
                  to={`game/multi`}
                  className="relative w-60 h-24 shadow-lg text-sm rounded flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0 group-hover:translate-y-0 ease-in-out">
                    👫
                    <span className="pr-2" />
                    Multi player mode
                  </span>
                </Link>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex flex-1 flex-col">
              <div className="underline">Human-ness</div>
              <div className="text-sm pt-2 text-gray-400">
                This is how you are likes a human
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl">45%</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-1 gap-2 pt-2">
          <Card>
            <div className="flex flex-1 flex-col">
              <div className="underline">AI-ness</div>
              <div className="text-sm pt-2 text-gray-400">
                This is how you are likes a AI
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl">45%</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex flex-1 flex-col">
              <div className="underline">AI Detection rate</div>
              <div className="text-sm pt-2 text-gray-400">
                This is the probability of you detecting AI-generated text
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl">45%</div>
              </div>
            </div>
          </Card>
        </div>
      </Transition>
    </div>
  );
};

export default Home;
