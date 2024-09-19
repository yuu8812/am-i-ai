import { AnimatePresence } from "framer-motion";
import React from "react";
import { FcSearch } from "react-icons/fc";
import Card from "src/component/Card";
import { motion } from "framer-motion";
import { LazyRateChart } from "src/component";

const MatchCard = ({
  iconUrl,
  name,
  humanDetectionRate,
  aiNessRate,
  meOrYou = "me",
  searching = false,
  chart = false,
  chartData,
  humanDetectionRank,
  aiNessRank,
}: {
  name?: string;
  iconUrl?: string;
  humanDetectionRate: number;
  aiNessRate: number;
  meOrYou?: "me" | "you";
  searching?: boolean;
  chart?: boolean;
  chartData?: { aiNess: number[]; humanDetect: number[]; dates: Date[] };
  humanDetectionRank?: number;
  aiNessRank?: number;
}) => {
  return (
    <Card>
      <div className="overflow-hidden flex flex-1">
        <AnimatePresence>
          {searching ? (
            <div className="flex items-center justify-center flex-1 flex-col">
              <div className="text-2xl font-semibold text-white pb-4">
                Searching for opponent
              </div>
              <div className="h-40 flex items-center justify-center">
                <FcSearch className="w-20 h-20 animate-pulse -rotate-6" />
              </div>
            </div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -200 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.3 }}
              className="w-40 h-full p-4 flex flex-1"
            >
              <div>
                <div className="text-2xl font-semibold text-white">
                  {meOrYou === "me" ? "You" : "Opponent"}
                </div>
                <div className="text-xl font-semibold text-gray-400 pt-2">
                  name: {name}
                </div>
                <div className="my-4">
                  <img
                    className="shadow-lg rounded"
                    src={iconUrl}
                    width={100}
                    height={100}
                    alt="icon_me"
                  />
                </div>
                <div className="text-xl font-semibold text-gray-400 pt-2 flex gap-4">
                  <div className="">humanDetectionRate:</div>
                  <div className="text-red-500">{humanDetectionRate}</div>
                </div>
                {humanDetectionRank && (
                  <div className="text-xl text-gray-400 pt-2 flex gap-4 font-semibold items-center">
                    <div className="">Rank:</div>
                    <div className="text-red-500">{humanDetectionRank}</div>
                  </div>
                )}
                <div className="text-xl font-semibold text-gray-400 pt-2 flex gap-4">
                  <div className="">aiNessRate:</div>
                  <div className="text-blue-500">{aiNessRate}</div>
                </div>
                {aiNessRank && (
                  <div className="text-xl font-semibold text-gray-400 pt-2 flex gap-4 items-center">
                    <div className="">Rank:</div>
                    <div className="text-blue-500">{aiNessRank}</div>
                  </div>
                )}
              </div>
              {chart && chartData && (
                <div className="flex flex-1">
                  <div className="p-2 w-full h-full">
                    <LazyRateChart
                      data={{
                        aiNess: chartData.aiNess,
                        humanDetect: chartData.humanDetect,
                        dates: chartData.dates,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default MatchCard;
