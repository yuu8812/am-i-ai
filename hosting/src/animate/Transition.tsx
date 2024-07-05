import { motion } from "framer-motion";
import { ReactNode } from "react";

const Transition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -500 }}
      exit={{ opacity: 0, x: 500 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
};

export default Transition;
