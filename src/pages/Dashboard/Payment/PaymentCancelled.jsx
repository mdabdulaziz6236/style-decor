import React from "react";
import { Link } from "react-router";
import { FaTimesCircle, FaArrowLeft, FaCreditCard } from "react-icons/fa";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 font-display">
      <div className="max-w-md w-full bg-base-200 shadow-2xl rounded-3xl border border-base-300 p-8 md:p-12 text-center relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-error/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-error/10 rounded-full blur-3xl"></div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-error/10 rounded-full shadow-inner">
            <FaTimesCircle className="text-6xl text-error drop-shadow-md" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-4xl font-black text-base-content mb-3">
          Payment Cancelled
        </h2>
        <p className="text-pink-500 mb-8 text-sm md:text-base">
          You have cancelled the payment process. Don't worry, no money was
          deducted from your account.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link to="/dashboard/my-bookings" className="w-full">
            <button className="btn btn-primary w-full text-white rounded-full shadow-lg hover:shadow-primary/30 transition-all">
              <FaCreditCard className="mr-2" /> Try Payment Again
            </button>
          </Link>

          <Link to="/" className="w-full">
            <button className="btn btn-ghost w-full rounded-full hover:bg-base-300">
              <FaArrowLeft className="mr-2" /> Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
