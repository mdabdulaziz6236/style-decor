import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaStar,
  FaMapMarkerAlt,
  FaAward,
  FaCrown,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Loading from "../../Components/Loading/Loading";

const TopDecorators = () => {
  const axiosPublic = useAxios();

  const { data: decorators = [], isLoading } = useQuery({
    queryKey: ["top-decorators"],
    queryFn: async () => {
      const res = await axiosPublic.get("/decorators/top/rating/home");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  // --- Seamless Loop Logic ---
  const duplicatedDecorators = [...decorators, ...decorators];
  const totalWidth = decorators.length * 304;

  const marqueeVariants = {
    animate: {
      x: [0, -totalWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="py-15 bg-base-200/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
            <FaAward className="text-lg animate-pulse" /> Client Favorites
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-base-content font-serif">
            Top Rated Decorators
          </h2>
        </motion.div>
      </div>

      {/* --- Marquee Slider Container --- */}
      <div className="relative w-full overflow-hidden">
        {/*  SIDE FADE EFFECT  */}
        <div className="absolute top-0 left-0 h-full w-10 md:w-23 bg-linear-to-r from-base-200/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-10 md:w-23 bg-linear-to-l from-base-200/50 to-transparent z-10 pointer-events-none"></div>

        {/* --- Moving Track --- */}
        <motion.div
          className="flex gap-6 w-max px-4"
          variants={marqueeVariants}
          animate="animate"
        >
          {duplicatedDecorators.map((decorator, index) => (
            <div
              key={`${decorator._id}-${index}`}
              className="group relative bg-[#1b2e35] rounded-2xl overflow-hidden border border-gray-700 hover:border-primary/50 shadow-xl transition-all duration-300 cursor-default w-[280px] shrink-0"
            >
              {/* Image Section */}
              <div className="h-56 overflow-hidden relative">
                <img
                  src={decorator.photoURL}
                  alt={decorator.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark linear Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#101d22] via-[#101d22]/20 to-transparent opacity-80"></div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-yellow-400 font-bold shadow-sm">
                  <FaStar size={12} />
                  <span className="text-white text-xs">
                    {decorator.rating ? decorator.rating.toFixed(1) : "New"}
                  </span>
                </div>
              </div>

              {/* --- CONTENT SECTION --- */}
              <div className="p-4 relative -mt-16 z-10">
                <div className="bg-[#1a2c32]/95 backdrop-blur-xl p-4 rounded-xl border border-gray-600/30 shadow-2xl text-center transform group-hover:-translate-y-1 transition-transform duration-300">
                  {/* PREMIUM SPECIALTY BADGE */}
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <FaCrown className="text-yellow-500 text-xs drop-shadow-md" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-orange-300 to-yellow-400">
                      {decorator.specialty} Expert
                    </span>
                  </div>

                  {/* Name with Verified Tick */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors truncate flex items-center justify-center gap-1">
                    {decorator.name}
                    <FaCheckCircle
                      className="text-blue-400 text-[10px]"
                      title="Verified Decorator"
                    />
                  </h3>

                  {/* Location */}
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <FaMapMarkerAlt size={12} className="text-gray-500" />
                    {decorator.district}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopDecorators;
