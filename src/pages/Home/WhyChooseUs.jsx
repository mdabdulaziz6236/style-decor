import React from "react";
import { FaCheckCircle, FaGem, FaLightbulb, FaSlidersH } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      text: "We constantly explore the latest in smart technology to offer futuristic solutions.",
    },
    {
      icon: <FaGem />,
      title: "Elegance",
      text: "Our aesthetic is rooted in timeless design, ensuring your space is modern and enduring.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Reliability",
      text: "We deliver what we promise, with meticulous attention to detail and unwavering quality.",
    },
    {
      icon: <FaSlidersH />,
      title: "Personalization",
      text: "Every project is a unique collaboration, tailored to your individual style and needs.",
    },
  ];

  return (
    <section className="bg-base-200/50 py-24 px-4 md:px-8 font-display overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-base-content">
            Our Core <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Values</span>
          </h2>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto leading-relaxed">
            The principles that guide our work, ensuring every project is a masterpiece.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              {/* 3D Tilt Wrapper with Border Radius Fix */}
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.4} 
                scale={1.05} 
                transitionSpeed={2500}
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                className="h-full"
                style={{ borderRadius: '1rem', overflow: 'hidden' }}
              >
                <div className="group bg-base-100 p-8 h-full relative border border-base-200 shadow-xl flex flex-col items-center text-center z-10">
                  
                  {/* Decorative Background Blob  */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-base-200 text-primary text-4xl shadow-sm transition-all duration-300     group-hover:text-white group-hover:shadow-sm group-hover:scale-110">
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default WhyChooseUs;