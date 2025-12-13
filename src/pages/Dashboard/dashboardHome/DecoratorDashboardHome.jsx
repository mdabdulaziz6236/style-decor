import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTasks,
  FaHammer,
  FaCheckCircle,
  FaWallet,
  FaUserClock,
  FaHourglassStart,
  FaClipboardList,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import { Link } from "react-router";

const DecoratorDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["decorator-home-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/decorator/stats/homepage?email=${user?.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const { detailedCounts, totalEarnings, pieData, recentBookings } = stats;
  console.log(detailedCounts)

  const COLORS = [
    "#3ABFF8",
    "#828DF8",
    "#FBBD23",
    "#36D399",
    "#F87272",
    "#A6ADBB",
  ];
  const statusCards = [
    {
      title: "New Assigned",
      count: detailedCounts?.assigned,
      icon: <FaTasks />,
      style: "bg-red-500/10 border-red-500/40 text-red-400",
    },
    {
      title: "Accepted",
      count: detailedCounts?.accepted,
      icon: <FaCheckCircle />,
      style: "bg-blue-500/10 border-blue-500/40 text-blue-400",
    },
    {
      title: "Planning",
      count: detailedCounts?.planning,
      icon: <FaClipboardList />,
      style: "bg-purple-500/10 border-purple-500/40 text-purple-400",
    },
    {
      title: "Materials Ready",
      count: detailedCounts?.materials,
      icon: <FaBoxOpen />,
      style: "bg-orange-500/10 border-orange-500/40 text-orange-400",
    },
    {
      title: "On The Way",
      count: detailedCounts?.onWay,
      icon: <FaTruck />,
      style: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400",
    },
    {
      title: "Working Now",
      count: detailedCounts?.working,
      icon: <FaHammer />,
      style: "bg-yellow-500/10 border-yellow-500/40 text-yellow-400",
    },
    {
      title: "Completed",
      count: detailedCounts?.completed,
      icon: <FaCheckCircle />,
      style: "bg-green-500/10 border-green-500/40 text-green-400",
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-sans text-base-content">
      {/* Welcome & Earnings Header */}
      <div className="mb-8 border-b border-gray-700 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Hello, <span className="text-primary">{user?.displayName}</span>
          </h2>
          <p className="text-gray-400 mt-2 font-medium text-lg">
            Track your projects and earnings here.
          </p>
        </div>

        {/* Total Earnings Card (High Contrast) */}
        <div className="w-full md:w-auto bg-linear-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between gap-6 transform hover:scale-105 transition-transform">
          <div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wider">
              Total Earnings
            </p>
            <h3 className="text-3xl font-black mt-1">
              ৳ {totalEarnings?.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <FaWallet className="text-3xl" />
          </div>
        </div>
      </div>

      {/* --- Detailed Stats Grid (Updated for Visibility) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {statusCards.map((card, index) => (
          
          <div
            key={index}
            className={`border ${card.style} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center group hover:-translate-y-1`}
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <div className="text-2xl font-extrabold mb-1 text-white">
              {card.count || 0}
            </div>
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-80">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* --- Charts & Tables --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart Card */}
        <div className="lg:col-span-1 bg-base-200 border border-gray-700 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-white w-full mb-6 border-l-4 border-accent pl-3">
            Status Overview
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                    padding: "10px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(val) => (
                    <span className="text-gray-300 font-semibold text-xs ml-1">
                      {val.replace(/_/g, " ").replace("Decorator", "")}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List Card */}
        <div className="lg:col-span-2 bg-base-200 border border-gray-700 p-6 rounded-3xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
              <FaUserClock className="text-primary" /> Recent Assignments
            </h3>
            <Link
              to="/dashboard/my-assigned-projects"
              className="btn btn-xs btn-ghost text-primary hover:bg-base-300"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="table w-full">
              {/* Header */}
              <thead className="bg-base-300 rounded-lg text-gray-300">
                <tr>
                  <th className="font-bold">Service Info</th>
                  <th className="font-bold">Date</th>
                  <th className="font-bold text-right pr-6">Current Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {recentBookings?.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-gray-700 hover:bg-base-300/50 transition-colors"
                  >
                    <td>
                      <div className="font-bold text-sm text-white">
                        {task.service_name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {task.district}
                      </div>
                    </td>
                    <td className="text-xs font-bold text-gray-400">
                      {task.booking_date}
                    </td>
                    <td className="text-right pr-4">
                      {/* Bright Badges */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          task.serviceStatus === "Completed"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : task.serviceStatus === "Working"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse"
                            : task.serviceStatus === "Decorator_Accepted"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : task.serviceStatus === "Decorator_Assigned"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-gray-600/30 text-gray-300"
                        }`}
                      >
                        {task.serviceStatus
                          ?.replace("Decorator_", "")
                          .replace(/_/g, " ") || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings?.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500">
                      No recent work found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorDashboardHome;
