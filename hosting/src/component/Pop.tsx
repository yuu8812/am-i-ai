import React from "react";
import { motion } from "framer-motion";

const variantsBy = (type: "top" | "bottom") => ({
  hide: {
    opacity: 0,
    y: type === "bottom" ? 50 : -50, // 下からスライドアップ
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // アニメーションの時間
      ease: "easeOut",
      delay: 1,
    },
  },
  exit: {
    opacity: 0,
    y: type === "bottom" ? 50 : -50, // 下からスライドアップ
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
});

const Pop = ({ type, text }: { type: "top" | "bottom"; text: string }) => {
  return (
    <motion.div
      key={"pop"}
      variants={variantsBy(type)}
      initial="hide"
      animate="show"
      exit="exit"
      className="relative px-6 text-center text-xs self-center bg-blue-500 text-white rounded-lg p-3 max-w-xs shadow-lg"
    >
      <div
        className={`${type === "bottom" && "-bottom-8 relative rotate-180"}`}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-blue-500" />
      </div>
      {text}
    </motion.div>
  );
};

export default Pop;
