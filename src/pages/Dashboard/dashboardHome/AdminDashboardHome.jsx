import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LuUsers,
  LuBadgeDollarSign,
  LuCalendarCheck2,
  LuLayoutGrid,
  LuEye,
  LuMapPin,
  LuX,
  LuClock,
  LuActivity,
} from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 1. Fetching Data
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Theme Colors
  const colors = {
    primary: "#13b6ec",
    secondary: "#92bbc9",
    base200: "#233f48",
    white: "#ffffff",
    accent: "#3abff8",
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    document.getElementById("details_modal").showModal();
  };

  const openTrackingModal = (booking) => {
    setSelectedBooking(booking);
    document.getElementById("tracking_modal").showModal();
  };

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  // Time Formatter for Timeline
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

  // Chart Data Formatting
  const barChartData =
    stats.serviceDemand?.map((item) => ({
      name: item._id,
      bookings: item.count,
    })) || [];
  const pieChartData =
    stats.bookingStatus?.map((item) => ({
      name: item._id || "Pending",
      value: item.count,
    })) || [];
  const PIE_COLORS = ["#13b6ec", "#3abff8", "#92bbc9", "#FFBB28", "#FF8042"];

  const statCards = [
    {
      id: 1,
      title: "Total Revenue",
      value: `৳ ${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: <LuBadgeDollarSign className="text-2xl text-white" />,
      bg: "bg-linear-to-br from-blue-600 to-blue-400",
    },
    {
      id: 2,
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <LuUsers className="text-2xl text-white" />,
      bg: "bg-linear-to-br from-teal-600 to-teal-400",
    },
    {
      id: 3,
      title: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: <LuCalendarCheck2 className="text-2xl text-white" />,
      bg: "bg-linear-to-br from-purple-600 to-purple-400",
    },
    {
      id: 4,
      title: "Total Services",
      value: stats.totalServices || 0,
      icon: <LuLayoutGrid className="text-2xl text-white" />,
      bg: "bg-linear-to-br from-orange-500 to-orange-400",
    },
  ];

  return (
    <div className="p-4 lg:p-8 bg-base-100 min-h-screen text-base-content font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-base-200 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-secondary mt-1 text-sm">
            Welcome back,{" "}
            <span className="text-primary font-semibold">
              {user?.displayName}
            </span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="relative overflow-hidden bg-base-200 p-5 rounded-2xl shadow-lg border border-base-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className={`text-2xl lg:text-3xl font-bold text-white`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl shadow-md ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-base-200 p-5 rounded-2xl shadow-lg border border-base-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>Popular
              Services
            </h3>
          </div>
          <div className="h-[250px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2c4c56"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={colors.secondary}
                  tick={{ fill: colors.secondary }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  stroke={colors.secondary}
                  tick={{ fill: colors.secondary }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1b2e35",
                    borderColor: "#2c4c56",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar
                  dataKey="bookings"
                  fill={colors.primary}
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pie Chart */}
        <div className="bg-base-200 p-5 rounded-2xl shadow-lg border min-w-0 border-base-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>Order
              Status
            </h3>
          </div>
          <div className="h-[250px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFAe",
                    borderColor: "#E0E0E0",
                    borderRadius: "8px",
                    color: "#1a1a1a",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ color: colors.secondary }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-base-200 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            Recent Bookings Latest {stats.recentBookings.length}
          </h3>
        </div>

        {/* VIEW 1: Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-[#1b2e35] text-secondary text-xs uppercase font-semibold">
              <tr>
                <th className="py-4">Client</th>
                <th>Service</th>
                <th>Date & Amount</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentBookings?.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-base-300 hover:bg-[#1b2e35]/50 transition-colors"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-linear-to-r from-primary to-accent text-white w-10 rounded-xl">
                            <img src={booking.service_image} alt="" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {booking.user_name}
                          </div>
                          <div className="text-xs text-secondary opacity-70">
                            {booking.user_phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-200">
                        {booking.service_name}
                      </div>
                      <div className="badge badge-xs badge-ghost text-[10px] mt-1">
                        {booking.category || "Decor"}
                      </div>
                    </td>
                    <td>
                      <div className="text-white font-semibold">
                        ৳ {booking.service_cost}
                      </div>
                      <div className="text-xs text-secondary opacity-60">
                        {formatDate(booking.booking_date)}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          booking.serviceStatus === "Completed"
                            ? "bg-green-500/10 border-green-500 text-green-500"
                            : booking.serviceStatus === "Pending"
                            ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                            : "bg-blue-500/10 border-blue-500 text-blue-500"
                        }`}
                      >
                        {booking.serviceStatus || "Pending"}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="btn btn-sm btn-square btn-ghost text-secondary hover:text-white hover:bg-base-100"
                        >
                          <LuEye size={18} />
                        </button>
                        <button
                          onClick={() => openTrackingModal(booking)}
                          className="btn btn-sm btn-square btn-ghost text-accent hover:text-white hover:bg-base-100"
                        >
                          <LuMapPin size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW 2: Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-4">
          {stats.recentBookings?.length > 0 ? (
            stats.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#1b2e35] p-4 rounded-xl border border-gray-700/50 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                      <img src={booking.service_image} alt="" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {booking.user_name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      booking.serviceStatus === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : booking.serviceStatus === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {booking.serviceStatus || "Pending"}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300 text-sm font-medium">
                    {booking.service_name}
                  </p>
                  <p className="text-primary font-bold text-lg mt-1">
                    ৳ {booking.service_cost}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openDetailsModal(booking)}
                    className="btn btn-sm btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full"
                  >
                    <LuEye className="mr-1" /> Details
                  </button>
                  <button
                    onClick={() => openTrackingModal(booking)}
                    className="btn btn-sm btn-primary text-white w-full"
                  >
                    <LuMapPin className="mr-1" /> Track
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              No recent bookings.
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* Details Modal */}
      <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-[#1b2e35] border border-base-300 shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-400 hover:text-white">
              <LuX />
            </button>
          </form>
          {selectedBooking && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <LuEye className="text-primary" /> Booking Details
              </h3>
              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-xl">
                  <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-2">
                    Customer
                  </p>
                  <div className="text-white font-medium">
                    {selectedBooking.user_name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedBooking.user_email}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedBooking.user_phone}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {selectedBooking.full_address}
                  </div>
                </div>
                <div className="bg-base-200 p-4 rounded-xl border border-primary/20">
                  <p className="text-xs text-primary uppercase font-bold tracking-wider mb-2">
                    Order Info
                  </p>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">Service:</span>
                    <span className="text-white text-sm text-right">
                      {selectedBooking.service_name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">Amount:</span>
                    <span className="text-primary font-bold">
                      ৳ {selectedBooking.service_cost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Trx ID:</span>
                    <span className="text-xs bg-[#101d22] px-2 py-0.5 rounded text-gray-300 font-mono">
                      {selectedBooking.transactionId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button>close</button>
        </form>
      </dialog>

      {/*  CLEANED TRACKING MODAL  */}
      <dialog
        id="tracking_modal"
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
                  Live Status History
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  ID: {selectedBooking.trackingId}
                </p>
              </div>

              {/* Centered Timeline */}
              <div className="w-full">
                <h4 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider flex items-center justify-center gap-2 border-b border-gray-700 pb-2">
                  <LuActivity /> Activity Log
                </h4>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-2">
                  {selectedBooking.trackingHistory &&
                  selectedBooking.trackingHistory.length > 0 ? (
                    <div className="relative border-l border-gray-700 ml-4 space-y-8 my-4">
                      {selectedBooking.trackingHistory.map((log, idx) => (
                        <div key={log._id} className="ml-6 relative">
                          {/* Timeline Dot */}
                          <div
                            className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 shadow-lg shadow-primary/20 ${
                              idx === 0
                                ? "bg-primary border-primary animate-pulse"
                                : "bg-[#1b2e35] border-gray-500"
                            }`}
                          ></div>

                          {/* Content */}
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
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                              <LuClock size={10} /> {formatDate(log.createdAt)}{" "}
                              • {formatTime(log.createdAt)}
                            </p>
                            <p className="text-xs text-gray-300 italic">
                              "{log.details}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-10 bg-base-200/50 rounded-xl">
                      No detailed history available for this order yet.
                    </div>
                  )}
                </div>
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

export default AdminHome;
