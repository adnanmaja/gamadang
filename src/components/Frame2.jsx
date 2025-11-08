import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Loader2, ShoppingBag } from "lucide-react";
import api from "@/services/api";
import { authService } from "@/services";
import fotoKantin from "@/assets/Foto_Kantin.svg";
import maskot from "@/assets/Maskot.png";

export const Frame2 = () => {
  const navigate = useNavigate();
  const { id: kantinId } = useParams();
  const [warungs, setWarungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Get user role
  const userRole = authService.getUserRole();
  const isSeller =
    userRole === "penjual" || userRole === "seller" || userRole === "admin";

  useEffect(() => {
    if (kantinId) {
      fetchWarungs();
    }
  }, [kantinId]);

  const fetchWarungs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kantin/${kantinId}/warung`);
      const data = response.data;

      setWarungs(
        data.map((warung) => ({
          id: warung.id,
          name: warung.name,
          image: warung.image_url || fotoKantin,
          menuCount: warung.menu_items?.length || 0,
          description: `Menyediakan ${
            warung.menu_items?.length || 0
          } menu pilihan untuk Anda`,
        }))
      );
    } catch (error) {
      console.error("Error fetching warungs:", error);
      // Set default data if error
      setWarungs([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full max-w-full md:max-w-[1200px] lg:max-w-[1445px] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] p-4 sm:p-6 md:p-10 bg-[#704443] rounded-[15px] md:rounded-[25px] border-4 md:border-[7px] border-dashed border-white">
        <div className="flex items-center gap-3 text-white text-base sm:text-lg md:text-2xl font-poppins">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 animate-spin" />
          Memuat warung...
        </div>
      </div>
    );
  }

  if (warungs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-full md:max-w-[1200px] lg:max-w-[1445px] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] p-4 sm:p-6 md:p-10 bg-[#704443] rounded-[15px] md:rounded-[25px] border-4 md:border-[7px] border-dashed border-white">
        <Store className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/50 mb-4" />
        <p className="text-white text-base sm:text-lg md:text-2xl font-poppins text-center px-4">
          Belum ada warung tersedia
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-start w-full max-w-full md:max-w-[1200px] lg:max-w-[1445px] max-h-[600px] sm:max-h-[700px] md:max-h-[800px] gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-10 bg-[#704443] rounded-[15px] md:rounded-[25px] border-4 md:border-[7px] border-dashed border-white overflow-y-auto overflow-x-hidden"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#d4a574 #704443",
      }}
    >
      {warungs.map((warung) => (
        <motion.div
          key={warung.id}
          variants={cardVariants}
          className="w-full max-w-full sm:max-w-[600px] md:max-w-[680px] px-2 sm:px-0"
        >
          <Card className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 w-full min-h-[280px] sm:min-h-[300px] md:min-h-[340px] rounded-[10px] border border-solid border-[#d6bfa3] bg-[linear-gradient(90deg,rgba(252,250,235,1)_18%,rgba(239,221,162,1)_100%)] shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 p-0 w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[228px] h-[180px] sm:h-[200px] md:h-[278px] bg-[#f8f2df] flex items-center justify-center rounded-md flex-shrink-0 overflow-hidden"
              >
                <img
                  className="max-w-full max-h-full object-contain"
                  alt={`Foto ${warung.name}`}
                  src={warung.image}
                  onError={(e) => {
                    e.target.src = maskot;
                  }}
                />
              </motion.div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5 sm:gap-2 md:gap-3 flex-1 w-full px-2 sm:px-0">
                <h2 className="font-poppins font-bold text-[#653e1d] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] leading-tight break-words w-full">
                  {warung.name}
                </h2>
                <p className="font-poppins text-[#c3a987] text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 w-full">
                  {warung.description}
                </p>

                {warung.menuCount > 0 && (
                  <Badge className="bg-green-100 text-green-800 font-poppins font-semibold text-xs md:text-sm px-2 md:px-3 py-1">
                    {warung.menuCount} Menu Tersedia
                  </Badge>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 mt-1 sm:mt-2 md:mt-3 w-full">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:flex-1 sm:max-w-[200px]"
                  >
                    <Button
                      onClick={() => navigate(`/menu-user/${warung.id}`)}
                      className="w-full h-[38px] sm:h-[40px] md:h-[45px] rounded-[15px] md:rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-xs sm:text-sm md:text-base shadow-lg"
                      type="button"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                      Lihat Menu
                    </Button>
                  </motion.div>

                  {/* Only show "Kelola Menu" button for sellers/admin */}
                  {isSeller && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:flex-1 sm:max-w-[200px]"
                    >
                      <Button
                        onClick={() => navigate("/menu")}
                        variant="outline"
                        className="w-full h-[38px] sm:h-[40px] md:h-[45px] rounded-[15px] md:rounded-[20px] border-2 border-[#653e1d] text-[#653e1d] hover:bg-[#653e1d] hover:text-white font-poppins font-bold text-xs sm:text-sm md:text-base shadow-md"
                        type="button"
                      >
                        <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                        Kelola Menu
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
