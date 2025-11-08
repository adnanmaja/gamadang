import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import gambar kantin
import fotoKantin from "@/assets/Foto_Kantin.svg";
import Biogeo from "@/assets/Maskot.png";
import Kansas from "@/assets/kss.svg";
import Pujale from "@/assets/Pujale.svg";
import Bonbin from "@/assets/unnamed.svg";

// Data semua kantin
const kantinData = [
  {
    id: 1,
    image: Biogeo,
    title: "Kantin BioGeo",
    description:
      "Kantin favorit mahasiswa FMIPA dengan suasana sejuk dan harga terjangkau. Banyak pilihan makanan berat dan ringan.",
  },
  {
    id: 2,
    image: Kansas,
    title: "Kansas",
    description:
      "Kantin Sastra yang terkenal dengan makanan kekiniannya dan spot nongkrong yang cozy banget buat anak FIB dan Filsafat.",
  },
  {
    id: 3,
    image: Pujale,
    title: "Pujale",
    description:
      "Pusat jajanan lengkap di area Teknik. Pujale dikenal dengan aneka nasi goreng, ayam geprek, dan minuman segar.",
  },
  {
    id: 4,
    image: Bonbin,
    title: "Bonbin",
    description:
      "Kantin di area Biologi yang dikelilingi pepohonan rindang, cocok buat makan sambil istirahat di siang hari.",
  },
];

export const Frame = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    switch (id) {
      case 1:
        navigate("/warung/1");
        break;
      case 2:
        navigate("/warung/2");
        break;
      case 3:
        navigate("/warung/3");
        break;
      case 4:
        navigate("/warung/4");
        break;
      default:
        alert("Halaman kantin belum tersedia 😅");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-wrap items-center justify-center w-full max-w-[1445px] min-h-[744px] gap-7 p-10 bg-[#704443] rounded-[25px] border-[5px] border-dashed border-white"
    >
      {kantinData.map((kantin) => (
        <motion.div key={kantin.id} variants={cardVariants}>
          <Card className="flex flex-col md:flex-row items-center gap-6 p-6 w-[90%] md:w-[600px] min-h-[320px] rounded-[10px] border border-solid border-[#d6bfa3] bg-[linear-gradient(90deg,rgba(252,250,235,1)_18%,rgba(239,221,162,1)_100%)] shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-0 w-full">
              {/* Gambar kantin */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-[228px] h-[278px] bg-white flex rounded-md flex-shrink-0 overflow-hidden"
              >
                <img
                  className="w-full h-full object-cover"
                  alt={`Foto ${kantin.title}`}
                  src={kantin.image}
                />
              </motion.div>

              {/* Teks dan tombol */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 flex-1">
                <h2 className="font-poppins font-bold text-[#653e1d] text-2xl md:text-[40px] leading-tight">
                  {kantin.title}
                </h2>
                <p className="font-poppins text-[#c3a987] text-sm md:text-base leading-relaxed line-clamp-3">
                  {kantin.description}
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleClick(kantin.id)}
                    className="mt-3 w-[180px] h-10 rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-base shadow-md"
                    aria-label={`Kunjungi ${kantin.title}`}
                  >
                    Kunjungi Kantin &gt;
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
