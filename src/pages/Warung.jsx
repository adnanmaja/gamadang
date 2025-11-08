import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "@/components/KantinBox";
import cihuy from "@/assets/cihuy.svg";
import Vector from "@/assets/Group4.svg";
import { Frame2 } from "@/components/Frame2";

export default function Warung() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const boxVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const mascotVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const frameVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col px-4 sm:px-6 py-10 relative overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, #F0BB78, #FFD39C), url(${Vector})`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* === TOP SECTION: Box and Mascot === */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-6xl mx-auto mt-16 md:mt-20 mb-8 md:mb-12"
      >
        {/* Box */}
        <motion.div
          variants={boxVariants}
          className="flex justify-center items-center w-full md:w-1/2 order-2 md:order-1"
        >
          <Box className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]" />
        </motion.div>

        {/* Mascot */}
        <motion.div
          variants={mascotVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center w-full md:w-1/2 order-1 md:order-2"
        >
          <img
            src={cihuy}
            alt="Maskot GamadanG"
            className="w-[220px] sm:w-[280px] md:w-[350px] lg:w-[450px] drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* === WARUNGS LIST === */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={frameVariants}
        className="relative z-10 flex justify-center items-start w-full px-2 sm:px-4 md:px-6 pb-10"
      >
        <Frame2 />
      </motion.div>
    </div>
  );
}
