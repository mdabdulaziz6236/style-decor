import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import img1 from '../../assets/about-1.png'; 

const Banner = () => {
  return (
    <div
      className="hero h-[500px] md:min-h-[70vh]  relative font-display"
      style={{
        backgroundImage: `url(${img1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-black/50"></div>
      <div className="hero-content text-center text-white relative z-10">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-5xl md:text-6xl font-black leading-tight"
          >
            Transform Your Events <br />
            <span className="text-primary drop-shadow-md">Into Memories</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mb-8 text-lg md:text-xl text-gray-200 font-medium"
          >
            StyleDecor connects you with the best decorators for weddings, 
            birthdays, and corporate events. Book your dream decoration today!
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <Link to="/services" className="btn btn-primary text-white btn-lg rounded-full px-10 shadow-xl border-none hover:bg-info hover:scale-105 transition-transform">
              Book Decoration Service
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;