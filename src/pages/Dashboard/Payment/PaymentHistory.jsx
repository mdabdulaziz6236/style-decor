import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaFilePdf,
  FaCalendarAlt,
  FaReceipt,
  FaDownload,
} from "react-icons/fa";
import {
  generateBulkPDF,
  generateSingleReceipt,
} from "../../../utils/pdfGenerator";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-base-200 pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-primary flex items-center gap-2">
            <FaReceipt /> Payment History
          </h2>
          <p className="text-white mt-1">
            You have made{" "}
            <span className="font-bold text-primary">{payments.length}</span>{" "}
            payments so far.
          </p>
        </div>

        {/* Bulk Download Button */}
        {payments.length > 0 && (
          <button
            onClick={() => generateBulkPDF(user, payments)}
            className="btn btn-primary text-white shadow-lg hover:shadow-primary/40 rounded-full px-6 w-full md:w-auto"
          >
            <FaFilePdf /> Download All Statement
          </button>
        )}
      </div>

      {/* ---------------- DESKTOP VIEW (TABLE) ---------------- */}
      <div className="hidden md:block  rounded-2xl border border-base-200 bg-base-100">
        <table className="table ">
          {/* Table Head */}
          <thead className="bg-base-200 text-base-content text-sm uppercase">
            <tr>
              <th>#</th>
              <th>Service Name</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className="hover:bg-base-200/40 transition-colors border-b border-base-200 last:border-none"
              >
                <th>{index + 1}</th>
                <td className="font-bold text-base-content/80">
                  {payment.service_name}
                </td>
                <td className="font-black text-primary">
                  {payment.amount}{" "}
                  <span className="text-xs font-normal text-base-content/80">
                    {payment.currency}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded text-primary font-semibold ">
                    {payment.transactionId}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-base-content/80">
                    <FaCalendarAlt />{" "}
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => generateSingleReceipt(user, payment)}
                    className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 tooltip"
                    data-tip="Download Receipt"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE VIEW (CLEAN CARDS) ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-5 flex flex-col gap-4"
          >
            {/* Card Header: Name & Amount */}
            <div className="flex justify-between items-start border-b border-base-200 pb-3">
              <div>
                <h3 className="font-bold text-lg text-base-content leading-tight">
                  {payment.service_name}
                </h3>
                <p className="text-xs text-base-content/80 mt-1">
                  {new Date(payment.paidAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="block font-black text-xl text-primary">
                  {payment.amount}{" "}
                  <span className="text-xs">{payment.currency}</span>
                </span>
                <span className="badge badge-xs badge-success text-white py-2 px-3 mt-1">
                  Paid
                </span>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="bg-base-200/50 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-base-content/80 tracking-wider">
                Transaction ID
              </span>
              <span className="font-mono text-xs text-primary mt-0.5 break-all">
                {payment.transactionId}
              </span>
            </div>

            {/* Download Button */}
            <button
              onClick={() => generateSingleReceipt(user, payment)}
              className="btn btn-outline btn-primary btn-sm w-full rounded-lg gap-2"
            >
              <FaDownload /> Download Receipt
            </button>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-base-200 rounded-3xl opacity-60">
            <FaReceipt className="text-6xl mb-4" />
            <p className="text-lg font-bold">No payment history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
