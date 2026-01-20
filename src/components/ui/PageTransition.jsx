import React from "react";
import { motion } from "framer-motion";

/**
 * PageTransition component using Framer Motion
 * Simple page transitions without directional navigation
 */
const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.95,
    },
    in: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
    },
    out: {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.95,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.7,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        width: "100%",
        minHeight: "100dvh",
        position: "relative",
        boxSizing: "border-box",
      }}
      onAnimationStart={() => {
        // Scroll to top when animation starts
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
