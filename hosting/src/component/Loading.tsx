import React from "react";
import { BallTriangle } from "react-loader-spinner";
import { AnimatePresence, motion } from "framer-motion";

const Loading = ({ visible }: { visible: boolean }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-1 items-center justify-center z-50"
        >
          <div className="relative z-10">
            <BallTriangle
              height="80"
              width="80"
              visible={true}
              color="red"
              radius={5}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
