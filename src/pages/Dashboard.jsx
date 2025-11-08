import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Text from "@/assets/Text.svg";
import maskot from "@/assets/Maskot.png";
import Vector from "@/assets/Group4.svg";
import MM from "@/assets/Mau_Madang_Dimana.svg";
import { Frame } from "@/components/Frame";

export default function Dashboard() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const mascotVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <div
        className="min-h-screen w-full flex flex-col px-6 py-20 gap-6"
        style={{
          backgroundImage: `linear-gradient(to right, #F0BB78, #FFD39C), url(${Vector})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* === BAGIAN ATAS: FLEX KIRI & KANAN === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 w-full max-w-6xl mx-auto"
        >
          {/* KIRI: Logo, Deskripsi, Tombol */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center items-center md:items-start gap-4 md:basis-1/2 text-white mt-40 ml-20"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={Text}
              alt="Gambar Text"
              className="w-[300px] sm:w-[450px] md:w-[600px] lg:w-[750px] scale-150 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
            />
          </motion.div>

          {/* KANAN: Maskot */}
          <motion.div
            initial="hidden"
            animate={["visible", "float"]}
            variants={mascotVariants}
            className="flex justify-center md:justify-end items-center md:basis-1/2 scale-75"
          >
            <img
              src={maskot}
              alt="Maskot GamadanG"
              className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[500px] drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* === BAGIAN GAMBAR BARU DI TENGAH === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col justify-center items-center mt-0 gap-6"
        >
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src={MM}
            alt="Mau Madang Dimana ?"
            className="w-[90%] md:w-[70%] max-w-[1500px] object-contain md:ml-[18px] z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-white p-8 flex justify-center items-center"
        >
          <Frame />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
