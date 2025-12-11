import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  LuCalendarClock,
  LuWallet,
  LuShoppingBag,
  LuArrowRight,
  LuMapPin,
  LuClock,
  LuX,
} from "react-icons/lu";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { LucideAlertCircle } from "lucide-react";

const UserDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user-stats/${user.email}`);
      return res.data;
    },
  });

  // Modal Handlers
  const openTrackingModal = (booking) => {
    setSelectedBooking(booking);
    document.getElementById("user_tracking_modal").showModal();
  };

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Time Formatter
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#101d22]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-base-100 min-h-screen text-base-content font-sans">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome Back,{" "}
          <span className="text-primary">{user?.displayName}!</span>
        </h1>
        <p className="text-secondary mt-1">
          Here is the update on your decoration plans.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Bookings */}
        <div className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-secondary text-sm font-medium mb-1">
              Total Bookings
            </p>
            <h3 className="text-3xl font-bold text-white">
              {stats.totalBookings || 0}
            </h3>
          </div>
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <LuShoppingBag size={24} />
          </div>
        </div>

        {/* Card 2: Total Spent */}
        <div className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-secondary text-sm font-medium mb-1">
              Total Spent
            </p>
            <h3 className="text-3xl font-bold text-white">
              ৳ {stats.totalSpent?.toLocaleString() || 0}
            </h3>
          </div>
          <div className="p-3 bg-accent/20 rounded-xl text-accent">
            <LuWallet size={24} />
          </div>
        </div>

        {/* Card 3:Pending Actions */}
        <div className="bg-linear-to-r from-primary/20 to-base-200 p-6 rounded-2xl border border-primary/30 shadow-lg flex items-center justify-between relative overflow-hidden">
          <div>
            <p className="text-primary text-sm font-bold mb-1 uppercase tracking-wider">
              Action Needed
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats.pendingBookings > 0
                ? `${stats.pendingBookings} Unpaid Orders`
                : "All Clear!"}
            </h3>
            {stats.pendingBookings > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Please clear your dues to confirm.
              </p>
            )}
          </div>
          <div className="p-3 bg-primary text-base-100 rounded-full">
            <LucideAlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* My Recent Bookings Section */}
      <div className="bg-base-200 rounded-2xl border border-base-300 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-base-300 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">My Recent Bookings</h3>
          <Link
            to="/dashboard/my-bookings"
            className="btn btn-sm btn-ghost text-primary hover:bg-base-100"
          >
            View All <LuArrowRight />
          </Link>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-[#1b2e35] text-secondary text-xs uppercase font-semibold">
              <tr>
                <th className="py-4">Service Details</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.myBookings?.length > 0 ? (
                stats.myBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-base-300 hover:bg-[#1b2e35]/50 transition-colors"
                  >
                    <td>
                      <div className="font-bold text-white">
                        {booking.service_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {booking.trackingId}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-300">
                        <LuCalendarClock className="text-secondary" />
                        {formatDate(booking.booking_date)}
                      </div>
                    </td>
                    <td className="font-bold text-primary">
                      ৳ {booking.service_cost}
                    </td>
                    <td>
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          booking.serviceStatus === "Completed"
                            ? "bg-green-500/10 border-green-500 text-green-500"
                            : booking.paymentStatus === "unpaid"
                            ? "bg-red-500/10 border-red-500 text-red-500"
                            : "bg-blue-500/10 border-blue-500 text-blue-500"
                        }`}
                      >
                        {booking.paymentStatus === "unpaid"
                          ? "Unpaid"
                          : booking.serviceStatus || "Pending"}
                      </span>
                    </td>
                    <td className="text-right pr-6">
                      {booking.paymentStatus === "unpaid" ? (
                        <Link
                          to={`/dashboard/payment/${booking._id}`}
                          className="btn btn-sm btn-primary text-white"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <button
                          onClick={() => openTrackingModal(booking)}
                          className="btn btn-sm btn-outline border-gray-600 text-gray-300 hover:text-white"
                        >
                          Track Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <p className="text-gray-500">
                      You haven't booked any services yet.
                    </p>
                    <Link
                      to="/services"
                      className="btn btn-primary btn-sm mt-3 text-white"
                    >
                      Book Now
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 space-y-4">
          {stats.myBookings?.length > 0 ? (
            stats.myBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#1b2e35] p-4 rounded-xl border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {booking.service_name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      booking.paymentStatus === "unpaid"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {booking.paymentStatus === "unpaid"
                      ? "Unpaid"
                      : booking.serviceStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-primary font-bold text-lg">
                    ৳ {booking.service_cost}
                  </p>
                </div>

                {booking.paymentStatus === "unpaid" ? (
                  <Link
                    to={`/dashboard/payment/${booking._id}`}
                    className="btn btn-sm btn-primary w-full text-white"
                  >
                    Pay Now
                  </Link>
                ) : (
                  <button
                    onClick={() => openTrackingModal(booking)}
                    className="btn btn-sm btn-outline w-full border-gray-600 text-gray-300"
                  >
                    Track Status
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No bookings yet.</p>
              <Link to="/services" className="btn btn-link text-primary">
                Browse Services
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      <dialog
        id="user_tracking_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-[#1b2e35] border border-base-300 mx-auto w-11/12 max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-400 hover:text-white">
              <LuX />
            </button>
          </form>
          {selectedBooking && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <LuMapPin size={24} />
                </div>
                <h3 className="font-bold text-xl text-white">
                  Service Timeline
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  TrxID: {selectedBooking.transactionId || "Pending"}
                </p>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-2">
                {selectedBooking.trackingHistory &&
                selectedBooking.trackingHistory.length > 0 ? (
                  <div className="relative border-l border-gray-700 ml-4 space-y-8 my-4">
                    {selectedBooking.trackingHistory.map((log, idx) => (
                      <div key={idx} className="ml-6 relative">
                        <div
                          className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 shadow-lg shadow-primary/20 ${
                            idx === 0
                              ? "bg-primary border-primary animate-pulse"
                              : "bg-[#1b2e35] border-gray-500"
                          }`}
                        ></div>
                        <div className="bg-base-200 p-3 rounded-lg border border-base-300 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span
                              className={`text-sm font-bold ${
                                idx === 0 ? "text-white" : "text-gray-400"
                              }`}
                            >
                              {log.status.replace(/_/g, " ")}
                            </span>
                            {idx === 0 && (
                              <span className="badge badge-xs badge-primary">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                            <LuClock size={10} /> {formatDate(log.createdAt)} •{" "}
                            {formatTime(log.createdAt)}
                          </p>
                          <p className="text-xs text-gray-300 italic">
                            "{log.details}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LuClock className="mx-auto text-gray-600 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">
                      Processing hasn't started yet.
                    </p>
                    <p className="text-xs text-gray-600">
                      Once assigned, updates will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserDashboardHome;
