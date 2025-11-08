import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Store, Plus, Minus } from "lucide-react";
import Vector from "@/assets/Group4.svg";
import api from "@/services/api";
import { useCart } from "@/contexts/CartContext"; // Import the CartContext

export default function MenuUser() {
  const { warungId } = useParams();
  const navigate = useNavigate();
  const [warungData, setWarungData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Use CartContext instead of local state
  const {
    items: cartItems,
    kantinInfo,
    addToCart: contextAddToCart,
    updateQuantity: contextUpdateQuantity,
    removeFromCart,
    calculateTotal,
    getCartItemCount,
    setKantin,
    switchKantin,
    isCartFromKantin
  } = useCart();

  useEffect(() => {
    if (warungId) {
      fetchWarungData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warungId]);

  const fetchWarungData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/warung/${warungId}`);
      const data = response.data;

      const warungInfo = {
        id: data.id,
        name: data.name,
        kantinName: data.kantin?.name || "Kantin",
        kantinAddress: data.kantin?.address || "",
        imageUrl: data.image_url,
      };

      setWarungData(warungInfo);

      // Set kantin info in context
      const kantinData = {
        id: data.kantin?.id || data.id,
        name: data.kantin?.name || data.name,
        description: data.kantin?.description || "",
        location: data.kantin?.address || data.kantin?.location || "",
        image_url: data.kantin?.image_url || data.image_url
      };
      
      // Use switchKantin to automatically clear cart if switching to different kantin
      switchKantin(kantinData);

      // Get menu items from warung
      const items = data.menu_items || [];
      setMenuItems(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          stock: item.stock,
          imageUrl: item.image_url,
          available: item.stock > 0,
        }))
      );

      // Initialize quantities
      const initialQuantities = {};
      items.forEach((item) => {
        initialQuantities[item.id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Error fetching warung data:", err);
      setError(err.response?.data?.detail || "Gagal memuat data warung");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId, change) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, Math.min(item.stock, currentQty + change));

    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));
  };

  const addToCart = (itemId) => {
    const item = menuItems.find((m) => m.id === itemId);
    const qty = quantities[itemId] || 0;

    if (!item || qty === 0) return;

    if (!kantinInfo) return;

    // Create the item with warung_id
    const itemToAdd = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: qty,
      image: item.imageUrl,
      image_url: item.imageUrl,
      warungId: parseInt(warungId),
      warungName: warungData?.name || "Warung",
      menu_item_id: item.id, // This is important for the API
    };

    console.log("Adding to cart:", itemToAdd);

    // Use contextAddToCart which now handles warung_id properly
    contextAddToCart(itemToAdd);

    // Reset quantity for this item
    setQuantities((prev) => ({
      ...prev,
      [itemId]: 0,
    }));

    console.log("Cart after addition:", cartItems);
    console.log("=== END ADD TO CART ===");
  };

  // Use context functions instead of local calculations
  const getCartCount = () => {
    return getCartItemCount();
  };

  const getCartTotal = () => {
    return calculateTotal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to right, #F0BB78, #FFD39C), url(${Vector})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-white text-2xl font-poppins"
        >
          <Loader2 className="w-8 h-8 animate-spin" />
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center gap-6 px-6"
        style={{
          backgroundImage: `linear-gradient(to right, #F0BB78, #FFD39C), url(${Vector})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-2xl font-poppins text-center"
        >
          {error}
        </motion.div>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-4 rounded-[20px] shadow-lg"
        >
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col px-6 py-20"
      style={{
        backgroundImage: `linear-gradient(to right, #F0BB78, #FFD39C), url(${Vector})`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 mt-20 mb-10"
      >
        {/* Warung Info Banner - Matching Figma Design */}
        {warungData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-[#704443] border-2 border-dashed border-white rounded-[25px] md:rounded-[44px] px-6 md:px-16 lg:px-20 py-6 md:py-10 flex flex-col gap-2 shadow-xl max-w-[647px] w-full"
          >
            <h2 className="font-poppins font-bold text-white text-2xl md:text-4xl lg:text-5xl leading-tight">
              {warungData.name}
            </h2>
            <p className="font-poppins text-white text-xl md:text-3xl lg:text-5xl leading-tight">
              {warungData.kantinName}
            </p>
            <p className="font-poppins font-light text-white text-base md:text-xl lg:text-[31.25px] leading-tight">
              07:00-15:00
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Menu Items Grid - 4 Column Layout matching Figma */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1605px] w-full mx-auto mb-20 bg-[#704443] border-4 md:border-[6px] border-dashed border-white rounded-[15px] md:rounded-[25px] p-6 md:p-10 lg:p-16"
      >
        {menuItems.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-20">
            <Store className="w-20 h-20 text-white/50 mx-auto mb-4" />
            <p className="text-white text-2xl font-poppins">
              Belum ada menu tersedia
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card className="bg-gradient-to-r from-[#fcfaeb] to-[#efdda2] border border-[#eaeaea] rounded-[10px] shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-3 md:p-4 flex flex-col h-full">
                      {/* Item Image - Fixed aspect ratio */}
                      <div className="relative mb-3 md:mb-4 rounded-t-[6px] overflow-hidden bg-white aspect-[337/207]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-12 h-12 md:w-16 md:h-16 text-gray-300" />
                          </div>
                        )}
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge className="bg-red-500 text-white text-sm md:text-base px-4 py-1">
                              Stok Habis
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="flex flex-col flex-1">
                        <div className="flex-1">
                          <h3 className="font-poppins font-bold text-[#653e1d] text-base md:text-lg lg:text-xl line-clamp-2 leading-tight mb-2">
                            {item.name}
                          </h3>
                          <p className="font-poppins text-xs md:text-sm text-[#c4a987] line-clamp-2 leading-relaxed mb-2 md:mb-3">
                            Nasi dipadukan dengan sayur dan lauk. Nikmat dan
                            lezat.
                          </p>
                        </div>

                        <p className="font-arial font-bold text-[#e7a24a] text-lg md:text-xl lg:text-2xl mb-3">
                          {formatCurrency(item.price)}
                        </p>

                        {/* Quantity Controls and Add to Cart Button */}
                        <div className="flex flex-col gap-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-center gap-2 bg-white border-2 border-[#d4a574] rounded-[10px] overflow-hidden p-1">
                            <Button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={
                                !item.available ||
                                (quantities[item.id] || 0) === 0
                              }
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-orange-50 disabled:opacity-30 rounded-md"
                            >
                              <Minus className="w-4 h-4 text-[#653e1d]" />
                            </Button>

                            <div className="flex-1 text-center min-w-[40px]">
                              <span className="font-poppins font-bold text-[#653e1d] text-base md:text-lg">
                                {quantities[item.id] || 0}
                              </span>
                            </div>

                            <Button
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={
                                !item.available ||
                                (quantities[item.id] || 0) >= item.stock
                              }
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-orange-50 disabled:opacity-30 rounded-md"
                            >
                              <Plus className="w-4 h-4 text-[#653e1d]" />
                            </Button>
                          </div>

                          {/* Add to Cart Button */}
                          <Button
                            onClick={() => addToCart(item.id)}
                            disabled={
                              !item.available ||
                              (quantities[item.id] || 0) === 0
                            }
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-medium text-xs md:text-sm px-3 py-2 md:py-2.5 rounded-[10px] shadow-[1px_1px_3px_0px_rgba(0,0,0,0.1),4px_4px_5px_0px_rgba(0,0,0,0.09)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                            Tambah Keranjang
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Bottom Cart Summary Section - Matching Figma Design */}
      <AnimatePresence>
        {getCartCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="max-w-[1605px] w-full mx-auto mb-8 px-4"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Total Belanja Box */}
              <div className="flex-1 bg-[#704443] border-2 border-dashed border-white rounded-[25px] md:rounded-[44px] px-6 md:px-16 lg:px-20 py-6 md:py-8 lg:py-10 shadow-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="font-poppins font-bold text-white text-xl md:text-2xl lg:text-4xl leading-tight mb-2">
                      Total Belanja:
                    </p>
                    <p className="font-poppins font-black text-white text-2xl md:text-3xl lg:text-5xl leading-tight">
                      {formatCurrency(getCartTotal())}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    <div className="flex flex-col items-center">
                      <p className="font-poppins font-bold text-white text-lg md:text-xl lg:text-4xl leading-tight">
                        Deskripsi
                      </p>
                      <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-full h-full rotate-180"
                        >
                          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button - Circular */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate("/keranjang")}
                  className="bg-[#704443] hover:bg-[#5a3635] text-white w-16 h-16 md:w-20 md:h-20 lg:w-[217px] lg:h-[217px] rounded-full md:rounded-[115px] shadow-xl flex items-center justify-center p-0 transition-all"
                >
                  <span className="font-poppins font-bold text-4xl md:text-6xl lg:text-[178px] leading-none">
                    &gt;
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {getCartCount() > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={() => navigate("/keranjang")}
              className="relative bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              Lihat Keranjang
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-base w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                {getCartCount()}
              </Badge>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}