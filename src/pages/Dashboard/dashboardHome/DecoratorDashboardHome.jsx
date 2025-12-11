import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaTasks,
  FaHammer,
  FaCheckCircle,
  FaWallet,
  FaUserClock,
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

  const {
    totalAssigned,
    activeTasks,
    completedTasks,
    totalEarnings,
    pieData,
    recentBookings,
  } = stats;
  const COLORS = ["#3ABFF8", "#828DF8", "#FBBD23", "#36D399"];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display text-base-content">
      {/* Welcome Section */}
      <div className="mb-8 border-b border-base-300 pb-4">
        <h2 className="text-3xl font-black text-primary">
          Welcome back, {user?.displayName}! 👋
        </h2>
        <p className="text-base-content opacity-80 mt-1 font-medium text-lg">
          Dashboard Overview & Recent Activities.
        </p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <div className="stat bg-base-100 border border-base-300 shadow-lg rounded-2xl">
          <div className="stat-figure text-primary">
            <FaTasks className="text-3xl" />
          </div>
          <div className="stat-title font-bold text-base-content opacity-70">
            Total Projects
          </div>
          <div className="stat-value text-primary">{totalAssigned || 0}</div>
          <div className="stat-desc text-base-content opacity-60 font-medium">
            Lifetime Assignments
          </div>
        </div>

        {/* Working / Active */}
        <div className="stat bg-base-100 border border-base-300 shadow-lg rounded-2xl">
          <div className="stat-figure text-warning">
            <FaHammer className="text-3xl" />
          </div>
          <div className="stat-title font-bold text-base-content opacity-70">
            Working Now
          </div>
          <div className="stat-value text-warning">{activeTasks || 0}</div>
          <div className="stat-desc text-base-content opacity-60 font-medium">
            Tasks in progress
          </div>
        </div>

        {/* Completed */}
        <div className="stat bg-base-100 border border-base-300 shadow-lg rounded-2xl">
          <div className="stat-figure text-success">
            <FaCheckCircle className="text-3xl" />
          </div>
          <div className="stat-title font-bold text-base-content opacity-70">
            Completed
          </div>
          <div className="stat-value text-success">{completedTasks || 0}</div>
          <div className="stat-desc text-base-content opacity-60 font-medium">
            Successfully delivered
          </div>
        </div>

        {/* Earnings */}
        <div className="stat bg-primary text-primary-content shadow-lg rounded-2xl border-none">
          <div className="stat-figure text-white/50">
            <FaWallet className="text-3xl" />
          </div>
          <div className="stat-title text-white/90 font-bold">
            Total Earnings
          </div>
          <div className="stat-value text-3xl">
            ৳ {totalEarnings?.toLocaleString()}
          </div>
          <div className="stat-desc text-white/80 font-medium">Paid jobs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Donut Chart --- */}
        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <div className="flex justify-between w-full mb-4">
            <h3 className="text-xl font-bold text-base-content">
              Task Status Breakdown
            </h3>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
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
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    color: "#000",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-base-content font-bold ml-1">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Recent Activity List --- */}
        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-base-content">
              Recent Assignments{" "}
              <FaUserClock className="text-base-content opacity-50" />
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="table w-full">
              {/* Header with clear text color */}
              <thead className="bg-base-200 rounded-lg">
                <tr>
                  <th className="text-base-content font-bold">Service Info</th>
                  <th className="text-base-content font-bold">Date</th>
                  <th className="text-base-content font-bold">
                    Current Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings?.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-base-200 last:border-none hover:bg-base-200/50 transition-colors"
                  >
                    <td>
                      <div className="font-bold text-sm text-base-content">
                        {task.service_name}
                      </div>
                      <div className="text-xs text-base-content font-medium opacity-70">
                        {task.district}
                      </div>
                    </td>
                    <td className="text-xs font-bold text-base-content opacity-80">
                      {task.booking_date}
                    </td>
                    <td>
                      {/* Badge Logic */}
                      {task.serviceStatus === "Completed" && (
                        <span className="badge badge-success text-white font-bold badge-sm">
                          Completed
                        </span>
                      )}
                      {task.serviceStatus === "Working" && (
                        <span className="badge badge-warning text-white font-bold badge-sm animate-pulse">
                          Working
                        </span>
                      )}
                      {task.serviceStatus === "Accepted" && (
                        <span className="badge badge-secondary text-white font-bold badge-sm">
                          Accepted
                        </span>
                      )}
                      {task.serviceStatus === "Decorator_Assigned" && (
                        <span className="badge badge-info text-white font-bold badge-sm">
                          Assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {recentBookings?.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-10 text-base-content opacity-50 font-medium"
                    >
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
