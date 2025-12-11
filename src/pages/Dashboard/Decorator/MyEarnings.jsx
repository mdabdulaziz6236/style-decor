import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaWallet,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";


const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: earningsData = {}, isLoading } = useQuery({
    queryKey: ["decorator-earnings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorator/earnings?email=${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const { totalEarnings, completedTasks, bookings, chartData } = earningsData;
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display text-base-content">
      
      {/* Header */}
      <div className="mb-8 border-b border-base-200 pb-4">
        <h2 className="text-3xl font-black text-primary flex items-center gap-2">
          <FaWallet /> My Earnings
        </h2>
        <p className="text-base-content/70 mt-1 font-medium">
          Overview of your completed projects & revenue.
        </p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-linear-to-r from-primary to-info text-white rounded-2xl shadow-lg border-none">
          <div className="stat-figure text-purple-700">
            <FaMoneyBillWave className="text-4xl" />
          </div>
          <div className="stat-title text-white/80 font-bold">Total Revenue</div>
          <div className="stat-value text-4xl">৳ {totalEarnings?.toLocaleString() || 0}</div>
          <div className="stat-desc text-white/70">From completed services</div>
        </div>

        <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-md">
          <div className="stat-figure text-success">
            <FaCalendarCheck className="text-4xl" />
          </div>
          <div className="stat-title font-bold text-base-content/70">Completed Jobs</div>
          <div className="stat-value text-success">{completedTasks || 0}</div>
          <div className="stat-desc">Fully paid & delivered</div>
        </div>

        <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-md">
          <div className="stat-figure text-warning">
            <FaChartLine className="text-4xl" />
          </div>
          <div className="stat-title font-bold text-base-content/70">Avg. per Job</div>
          <div className="stat-value text-warning">
            ৳ {completedTasks > 0 ? Math.round(totalEarnings / completedTasks).toLocaleString() : 0}
          </div>
          <div className="stat-desc">Performance metric</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Chart Section (FIXED) --- */}
        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-base-content">Earnings Overview</h3>
          
          {/* FIX: Fixed Height div added */}
          <div className="w-full" style={{ height: 300 }}>
            {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #ddd' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="amount" fill="#13b6ec" barSize={40} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-neutral/50">
                    No chart data available yet.
                </div>
            )}
          </div>
        </div>

        {/* --- Recent History List --- */}
        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-base-content">Recent Transactions</h3>
          <div className="overflow-x-auto overflow-y-auto flex-1 h-64 pr-2">
            <table className="table w-full">
              <thead className="bg-base-200 sticky top-0 z-10 text-base-content">
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/50 border-b border-base-200">
                    <td>
                      <div className="font-bold text-sm text-base-content">{item.service_name}</div>
                      <div className="text-xs opacity-50 font-mono">{item.trackingId}</div>
                    </td>
                    <td className="text-xs font-medium text-base-content/70">
                        {item.booking_date}
                    </td>
                    <td className="text-right font-mono font-bold text-success">
                      + ৳{item.service_cost?.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {bookings?.length === 0 && (
                    <tr>
                        <td colSpan="3" className="text-center py-10 text-neutral/50">
                            No earnings history found.
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

export default MyEarnings;