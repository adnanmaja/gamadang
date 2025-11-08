import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext';
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuRouter from "./pages/MenuRouter";
import Pesanan from "./pages/Pesanan";
import Analytics from "./pages/Analytics";
import Warung from "./pages/Warung";
import Status from "./pages/Status";
import Keranjang from "./pages/Keranjang";
import MenuUser from "./pages/MenuUser";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <CartProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<MenuRouter />} />
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/warung/:id" element={<Warung />} />
        <Route path="/status/:orderId" element={<Status />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/menu-user/:warungId" element={<MenuUser />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
