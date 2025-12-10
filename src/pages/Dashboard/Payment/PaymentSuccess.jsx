import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { FaCheckCircle, FaListAlt, FaHome, FaCopy } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          setPaymentInfo({
            transactionId: res.data.transactionId,
            trackingId: res.data.trackingId,
          });
        })
        .catch(err => console.error(err));
    }
  }, [sessionId, axiosSecure]);
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Copied!',
      showConfirmButton: false,
      timer: 1000
    });
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 font-display">
      
      <div className="card w-full max-w-lg bg-base-200 shadow-2xl border border-base-300">
        <div className="card-body text-center items-center p-8 md:p-12">
          
          {/* Success Animation Icon */}
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
            <FaCheckCircle className="text-6xl text-success drop-shadow-md" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-primary mb-2">
            Payment Successful!
          </h2>
          <p className="text-neutral/60 mb-8">
            Thank you! Your payment has been processed securely.
          </p>

          {/* Payment Details Box */}
          {paymentInfo ? (
            <div className="w-full bg-base-100 p-6 rounded-xl border border-base-300 space-y-4 mb-8 text-left">
              
              {/* Transaction ID */}
              <div>
                <p className="text-xs text-white font-semibold uppercase tracking-wider mb-1">Transaction ID</p>
                <div className="flex justify-between items-center bg-base-200 p-3 rounded-lg">
                    <span className="font-mono text-lg  break-all text-primary font-bold">
                        {paymentInfo.transactionId}
                    </span>
                    <button onClick={() => handleCopy(paymentInfo.transactionId)} className="btn btn-ghost btn-xs text-primary">
                        <FaCopy />
                    </button>
                </div>
              </div>

              {/* Tracking ID */}
              <div>
                <p className="text-xs text-white font-semibold uppercase tracking-wider mb-1">Parcel Tracking ID</p>
                <div className="flex justify-between items-center bg-primary/10 border border-primary/20 p-3 rounded-lg">
                    <span className="font-mono text-lg font-bold text-primary break-all">
                        {paymentInfo.trackingId}
                    </span>
                    <button onClick={() => handleCopy(paymentInfo.trackingId)} className="btn btn-ghost btn-xs text-primary">
                        <FaCopy />
                    </button>
                </div>
                <p className="text-[10px] text-white mt-1 pl-1">
                    *Save this ID to track your service status.
                </p>
              </div>

            </div>
          ) : (
            // Loading State
            <div className="w-full h-40 flex items-center justify-center bg-base-100 rounded-xl mb-8">
                <span className="loading loading-bars loading-md text-primary"></span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Link to="/dashboard/my-bookings" className="w-full">
                <button className="btn btn-primary w-full text-white shadow-lg rounded-full">
                    <FaListAlt className="mr-2" /> View My Bookings
                </button>
            </Link>
            
            <Link to="/" className="w-full">
                <button className="btn btn-ghost w-full hover:bg-base-300 rounded-full">
                    <FaHome className="mr-2" /> Return Home
                </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;