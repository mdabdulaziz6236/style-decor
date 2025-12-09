import React from "react";
import { Link, useNavigate } from "react-router";
import { FaLock, FaArrowLeft, FaHome } from "react-icons/fa";
import bgImg from '../../assets/about-2.png'

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="hero min-h-screen bg-base-200 font-display relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="hero-overlay bg-black/20"></div>

      {/* Glass Card */}
      <div className="hero-content text-center text-neutral-content p-0">
        <div className="max-w-xl w-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 md:p-14 relative overflow-hidden">
          
          {/* Animated bg */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-error/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-warning/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Icon */}
          <div className="relative flex justify-center mb-6">
            <div className="p-6 bg-base-100/30 rounded-full border border-white/10 shadow-inner">
                <FaLock className="text-6xl text-error drop-shadow-md" />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="mb-2 text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-error to-warning">
            403
          </h1>
          <h2 className="mb-4 text-3xl font-bold text-white tracking-wide">
            Access Denied
          </h2>
          <p className="mb-8 text-gray-300 text-lg leading-relaxed">
            Stop right there! You don't have the necessary permissions to access this area. It's restricted for authorized personnel only.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-outline text-white border-white/30 hover:bg-white/10 hover:border-white rounded-full px-8"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>

            <Link to="/">
              <button className="btn btn-primary text-white rounded-full px-8 shadow-lg shadow-primary/30 border-none">
                <FaHome className="mr-2" /> Back Home
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;