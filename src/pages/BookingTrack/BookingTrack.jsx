import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaCheckCircle, FaBoxOpen } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";

const BookingTrack = () => {
  const { trackingId } = useParams();
  const axios = useAxios();
  const { data: trackingLogs = [], isLoading } = useQuery({
    queryKey: ["booking-track", trackingId],
    queryFn: async () => {
      const res = await axios.get(`/bookings/track/${trackingId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-base-100 font-display p-4">
      
      {/* Header */}
      <div className="text-center pb-12 space-y-2">
        <h3 className="text-3xl md:text-4xl font-black text-primary">
          Track Your Booking
        </h3>
        <p className="text-white text-lg">
          Tracking ID : <span className="font-mono font-bold text-red-500">{trackingId}</span>
        </p>
      </div>

      {/* Timeline Section */}
      <div className="w-full max-w-4xl">
        {trackingLogs.length > 0 ? (
          <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
            
            {trackingLogs.map((log, index) => (
              <li className="flex justify-center space-x-1.5 items-center" key={log._id || index}>
                
                {/* Connecting Lines */}
                {index !== 0 && <hr className="bg-primary" />}
                
                {/* Date & Time (Left Side) */}
                <div className="timeline-start md:text-end mb-10 md:mb-0">
                  <div className="font-mono italic text-sm opacity-70">
                    {new Date(log.date || log.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                {/* Icon (Middle) */}
                <div className="timeline-middle">
                  <div className="bg-primary p-2 rounded-full text-white shadow-lg">
                    <FaCheckCircle className="text-lg" />
                  </div>
                </div>

                {/* Details (Right Side) */}
                <div className="timeline-end mb-10 md:mb-0">
                  <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
                    <p className="text-yellow-600 mt-1">
                      {log.details || "Your booking status has been updated."}
                    </p>
                  </div>
                </div>
                
                {/* Bottom Line */}
                {index !== trackingLogs.length - 1 && <hr className="bg-primary"/>}
              </li>
            ))}
          </ul>
        ) : (
          /* Empty State */
          <div className="text-center py-10   rounded-2xl">
            <FaBoxOpen className="text-6xl text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No tracking history found.</h3>
            <p className="text-sm text-primary">Please check the ID or try again later.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default BookingTrack;