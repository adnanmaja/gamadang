import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import GamadanG from "@/assets/GamadanG.svg";
import maskot from "@/assets/Maskot.png";
import Vector from "@/assets/Vector.svg";
import KenapaGamadang from "@/assets/Kenapa_GamadanG.svg";
import Frame4 from "@/assets/Frame4.svg";

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
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
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-14 w-full max-w-6xl mx-auto pt-20"
        >
          {/* KIRI: Logo, Deskripsi, Tombol */}
          <div className="flex flex-col justify-center items-center md:items-start gap-8 md:basis-1/2 text-white">
            <motion.img
              variants={itemVariants}
              src={GamadanG}
              alt="Logo GamadanG"
              className="h-[120px] w-auto drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
            />
            <motion.div
              variants={itemVariants}
              className="text-center text-[12px] sm:text-[22px] md:text-[24px] font-poppins font-medium leading-relaxed max-w-[500px] md:ml-[19px]"
            >
              <strong>GAMADANG</strong> adalah website yang memudahkan mahasiswa
              Universitas Gadjah Mada dalam memesan makanan dan meja di kantin
              tanpa perlu antre terlebih dahulu. Praktis & cepat, buat waktu
              makan di kampus jadi lebih nyaman.
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-center w-full mt-4"
            >
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="relative w-[280px] md:w-[353px] h-[60px] md:h-[76px] rounded-[20px] bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-poppins font-bold text-[19px] md:text-[20px] shadow-[0_5px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                Mulai Madang &gt;
              </Button>
            </motion.div>
          </div>

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
          id="kenapa-gamadang"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col justify-center items-center mt-0 gap-6"
        >
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src={KenapaGamadang}
            alt="Kenapa Gamadang"
            className="w-[90%] md:w-[80%] max-w-[1500px] object-contain md:ml-[150px] z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            src={Frame4}
            alt="Frame 4"
            className="w-[90%] md:w-[95%] max-w-[1000px] object-contain -mt-12 md:ml-[120px] top-[85%]"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
