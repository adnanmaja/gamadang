import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/orderService";
import Vector from "@/assets/Group4.svg";

export default function Status() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract numeric ID from orderId parameter
        // Handle both formats: "1" or "ORDER-001"
        const numericId =
          orderId
            .toString()
            .replace(/ORDER-/i, "")
            .replace(/^0+/, "") || orderId;

        // Fetch order with details from API
        const data = await orderService.getById(numericId);

        // Transform API data to component format
        const transformedData = {
          id: `ORDER-${String(data.id).padStart(3, "0")}`,
          date: new Date(data.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          status: getStatusText(data.payment_status),
          items:
            data.order_items?.map((item) => ({
              id: item.id,
              name: item.menu_item.name,
              quantity: item.quantity,
              price: parseFloat(item.price),
            })) || [],
          total: parseFloat(data.total_price),
        };

        setOrderData(transformedData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.response?.data?.detail || "Gagal memuat data pesanan");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const getStatusText = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "pending":
        return "Proses";
      case "paid":
      case "completed":
        return "Selesai";
      case "cancelled":
      case "failed":
        return "Dibatalkan";
      default:
        return paymentStatus || "Proses";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Proses":
        return "bg-[#f8f2a9] text-[#6b621c]";
      case "Selesai":
        return "bg-green-200 text-green-800";
      case "Dibatalkan":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
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
          className="text-white text-2xl font-poppins"
        >
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
          onClick={() => navigate("/pesanan")}
          className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-4 rounded-[20px] shadow-lg"
        >
          Kembali ke Pesanan
        </Button>
      </div>
    );
  }

  if (!orderData) {
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
          Pesanan tidak ditemukan
        </motion.div>
        <Button
          onClick={() => navigate("/pesanan")}
          className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-4 rounded-[20px] shadow-lg"
        >
          Kembali ke Pesanan
        </Button>
      </div>
    );
  }

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
        className="flex justify-center items-center mt-20 mb-10"
      >
        <h1 className="font-javassoul text-[80px] md:text-[129px] text-white text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
          Status Pesanan
        </h1>
      </motion.div>

      {/* Order Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl w-full mx-auto"
      >
        <Card className="bg-white border border-[#eaeaea] rounded-[30px] shadow-2xl p-8 md:p-12">
          <CardContent className="p-0">
            {/* Header with Order ID and Status */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
            >
              <div>
                <h2 className="font-poppins font-bold text-[#653e1d] text-[40px] md:text-[55px] leading-none">
                  {orderData.id}
                </h2>
                <p className="font-poppins text-[#6b6b6b] text-[24px] md:text-[35px] mt-2">
                  Pesanan pada {orderData.date}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(
                  orderData.status
                )} rounded-[30px] px-8 py-4 text-[32px] md:text-[48px] font-poppins font-semibold shadow-md`}
              >
                {orderData.status}
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Separator className="my-8 bg-[#eaeaea] h-[2px]" />
            </motion.div>

            {/* Order Items */}
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="flex justify-between items-center py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-poppins font-medium text-[#653e1d] text-[28px] md:text-[35px]">
                      {item.name}
                    </span>
                    <span className="font-poppins font-medium text-[#653e1d] text-[28px] md:text-[35px]">
                      ×{item.quantity}
                    </span>
                  </div>
                  <span className="font-poppins font-medium text-[#653e1d] text-[28px] md:text-[35px]">
                    {formatCurrency(item.price)}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants}>
              <Separator className="my-8 bg-[#eaeaea] h-[2px]" />
            </motion.div>

            {/* Total */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center pt-4"
            >
              <h3 className="font-poppins font-bold text-[#653e1d] text-[42px] md:text-[52px]">
                Total
              </h3>
              <span className="font-arial font-bold text-[#e7a24a] text-[42px] md:text-[52px]">
                {formatCurrency(orderData.total)}
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 pt-8 border-t border-[#eaeaea]"
            >
              <Button
                onClick={() => navigate("/pesanan")}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-poppins font-bold text-lg px-8 py-6 rounded-[20px] shadow-lg"
              >
                Lihat Semua Pesanan
              </Button>
              <Button
                onClick={() => navigate("/menu")}
                variant="outline"
                className="w-full sm:w-auto border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-poppins font-bold text-lg px-8 py-6 rounded-[20px]"
              >
                Pesan Lagi
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
