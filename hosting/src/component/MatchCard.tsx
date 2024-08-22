import { AnimatePresence } from "framer-motion";
import React from "react";
import { FcSearch } from "react-icons/fc";
import Card from "src/component/Card";
import { motion } from "framer-motion";

const MatchCard = ({
  iconUrl,
  name,
  rate,
  meOrYou = "me",
  searching = false,
}: {
  name?: string;
  iconUrl?: string;
  rate: string;
  meOrYou?: "me" | "you";
  searching?: boolean;
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
              className="w-40 h-[400px] p-4"
            >
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
              <div className="text-xl font-semibold text-gray-400 pt-2">
                rate: {rate}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default MatchCard;
