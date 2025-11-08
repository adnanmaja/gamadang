import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Palelu from "../assets/Palelu.svg";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  const { isLoggedIn, currentUser, logout } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };


  return (
    <motion.div
      initial={false}
      animate={{
        top: isScrolled ? 16 : 0,
        paddingLeft: isScrolled ? 16 : 0,
        paddingRight: isScrolled ? 16 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed left-0 right-0 z-50"
    >
      <motion.nav
        initial={false}
        animate={{
          borderRadius: isScrolled ? 30 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          backdrop-blur-md bg-white/90 border-b-4 border-orange-400
          ${
            isScrolled
              ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25),0_8px_16px_-8px_rgba(0,0,0,0.1)]"
              : "shadow-lg"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <img
                src={Palelu}
                alt="GamadanG"
                className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14"
              />
              <h1 className="font-javassoul text-lg sm:text-3xl md:text-4xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg whitespace-nowrap leading-none mt-1 sm:mt-2">
                GamadanG
              </h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-4 md:gap-8 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  {/* Welcome message with user name
                  <div className="hidden sm:flex items-center">
                    <motion.div
                      className="text-gray-700 font-poppins font-semibold text-[10px] sm:text-sm md:text-base whitespace-nowrap"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Hi, <span className="text-orange-600">{currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}</span>
                    </motion.div>
                  </div> */}

                  {/* Menu items for logged in users */}
                  <Link to="/menu">
                    <motion.div
                      className="text-gray-700 hover:text-orange-600 font-poppins font-semibold transition-colors duration-300 text-[10px] sm:text-sm md:text-base whitespace-nowrap hidden sm:block"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Menu
                    </motion.div>
                  </Link>

                  <Link to="/pesanan">
                    <motion.div
                      className="text-gray-700 hover:text-orange-600 font-poppins font-semibold transition-colors duration-300 text-[10px] sm:text-sm md:text-base whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Pesanan
                    </motion.div>
                  </Link>

                  <Link to="/analytics">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-poppins font-bold px-2 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full shadow-lg border-2 border-orange-600 text-[10px] sm:text-sm md:text-base whitespace-nowrap">
                        Analytics
                      </div>
                    </motion.div>
                  </Link>

                  {/* Logout button */}
                  <motion.button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-orange-600 font-poppins font-semibold transition-colors duration-300 text-[10px] sm:text-sm md:text-base whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                /* Login button for non-logged in users */
                <motion.button
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-poppins font-bold px-2 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full shadow-lg border-2 border-orange-600 text-[10px] sm:text-sm md:text-base whitespace-nowrap">
                    Log in
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}

export default Navbar;