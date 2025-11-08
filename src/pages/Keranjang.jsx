import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Minus, X, Loader2 } from "lucide-react";
import { orderService } from "@/services";
import Vector from "@/assets/Group4.svg";

export default function Keranjang() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kantinInfo, setKantinInfo] = useState({
    name: "Kantin BioGeo Fakultas",
    address: "Jl. Tadika Mesra, No. 15, Kec. Mlati",
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    try {
      setLoading(true);

      // Create order data
      const orderData = {
        user_id: 1, // TODO: Get from auth context
        kantin_id: 1, // TODO: Get from cart context
        total_price: calculateTotal(),
        payment_status: "pending",
        created_at: new Date().toISOString(),
      };

      // Create the order
      const createdOrder = await orderService.create(orderData);

      // Navigate to status page
      navigate(`/status/${createdOrder.id}`);

      // Clear cart
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
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

  return (
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
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center items-center mt-20 mb-6"
      >
        <h1 className="font-javassoul text-[80px] md:text-[129px] text-white text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
          Keranjang Belanja
        </h1>
      </motion.div>

      {/* Kantin Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-6xl w-full mx-auto"
      >
        <Card className="bg-[#704443] border-2 border-dashed border-white rounded-[44px] shadow-lg">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3">
                <MapPin className="w-10 h-10 text-[#704443]" />
              </div>
              <div>
                <h2 className="font-poppins font-bold text-white text-[28px] md:text-[36px]">
                  {kantinInfo.name} | {kantinInfo.address}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cart Items */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl w-full mx-auto"
      >
        <Card className="bg-white border border-[#eaeaea] rounded-[30px] shadow-2xl p-8 md:p-12">
          <CardContent className="p-0">
            {cartItems.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center py-20">
                <p className="font-poppins text-[#6b6b6b] text-[32px] mb-6">
                  Keranjang belanja kosong
                </p>
                <Button
                  onClick={() => navigate("/menu")}
                  className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-6 rounded-[20px] shadow-lg"
                >
                  Mulai Belanja
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center gap-6 pb-6 border-b border-[#eaeaea] last:border-b-0"
                      >
                        {/* Item Image */}
                        <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={item.image || "/api/placeholder/180/180"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="font-poppins font-semibold text-[#653e1d] text-[32px] md:text-[44px] mb-2">
                            {item.name}
                          </h3>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 border border-[#eaeaea] rounded-[5px] overflow-hidden">
                          <Button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            variant="ghost"
                            className="h-[65px] w-[62px] rounded-none hover:bg-gray-100 border-r border-[#eaeaea]"
                          >
                            <Minus className="w-6 h-6 text-[#653e1d]" />
                          </Button>
                          <div className="h-[65px] w-[85px] flex items-center justify-center">
                            <span className="font-poppins font-semibold text-[#653e1d] text-[34px]">
                              {item.quantity}
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            variant="ghost"
                            className="h-[65px] w-[62px] rounded-none hover:bg-gray-100 border-l border-[#eaeaea]"
                          >
                            <Plus className="w-6 h-6 text-[#653e1d]" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="ghost"
                          className="p-2 hover:bg-red-50"
                        >
                          <X className="w-6 h-6 text-red-500" />
                        </Button>

                        {/* Price */}
                        <div className="text-right min-w-[150px]">
                          <p className="font-poppins text-[#6b6b6b] text-[32px] md:text-[41px]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Total */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between items-center pt-8 mt-8 border-t-2 border-[#eaeaea]"
                >
                  <h3 className="font-poppins font-bold text-[#653e1d] text-[38px] md:text-[44px]">
                    Total Harga
                  </h3>
                  <span className="font-arial font-bold text-[#e7a24a] text-[42px] md:text-[49px]">
                    {formatCurrency(calculateTotal())}
                  </span>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Method */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl w-full mx-auto"
        >
          <Card className="bg-white rounded-[30px] shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-poppins font-bold text-[#653e1d] text-[32px] md:text-[39px]">
                  Metode Pembayaran
                </h3>
                <button className="font-poppins font-medium text-[#439be8] text-[32px] md:text-[39px] underline">
                  Lihat Semua
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-[#653e1d] rounded-[30px] p-4 w-[132px] h-[71px] flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">QRIS</span>
                </div>
                <p className="font-poppins text-[#653e1d] text-[32px] md:text-[39px]">
                  Tunai
                </p>
              </div>

              {/* Checkout Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-[28px] py-8 rounded-[20px] shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Pesanan"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
