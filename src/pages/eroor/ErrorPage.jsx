import React from "react";
import { Link, useRouteError, useNavigate } from "react-router";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import bgImg from "../../assets/about-1.png";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div
      className="hero min-h-screen bg-base-200 font-display relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      {/* Dark Overlay in bg */}
      <div className="hero-overlay bg-black/50"></div>

      {/*  Card */}
      <div className="hero-content text-center text-neutral-content p-0">
        <div className="max-w-2xl w-full m-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-10 md:p-16 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/40 rounded-full blur-3xl animate-pulse delay-700"></div>
          <h1 className="mb-2 text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-secondary drop-shadow-lg">
            404
          </h1>

          <h2 className="mb-5 text-4xl font-bold text-white">
            Space Not Found
          </h2>

          <p className="mb-8 text-gray-300 text-lg">
            The page you are looking for might have been moved, deleted, or
            possibly never existed. It seems you've wandered into an empty room.
          </p>

          {/* Technical Error Message */}
          {error && (
            <div className="mb-8 p-3 bg-red-500/20 border border-red-500/30 rounded-lg inline-block">
              <p className="text-red-200 font-mono text-sm">
                Error Code: {error.status || 404} -{" "}
                {error.statusText || error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline text-white border-white/40 hover:bg-white/20 hover:border-white rounded-full px-8"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>

            <Link to="/">
              <button className="btn btn-primary text-white rounded-full px-8 shadow-lg shadow-primary/30 border-none">
                <FaHome className="mr-2" /> Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
