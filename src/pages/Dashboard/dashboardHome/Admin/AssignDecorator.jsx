import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaCheckCircle,
  FaMoneyBillWave,
  FaTasks,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Components/Loading/Loading";

const AssignDecorator = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const axiosSecure = useAxiosSecure();
  const decoratorModalRef = useRef();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", "pending-assign"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/bookings-assign?serviceStatus=pending-assign&paymentStatus=paid"
      );
      return res.data;
    },
  });

  const { data: decorators = [], isLoading: isDecoratorsLoading } = useQuery({
    queryKey: ["decorators", selectedBooking?.district],
    enabled: !!selectedBooking?.district,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/decorators/available?district=${selectedBooking.district}`
      );
      return res.data;
    },
  });

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    decoratorModalRef.current.showModal();
  };

  const handleAssignDecorator = (decorator) => {
    const assignInfo = {
      decoratorId: decorator._id,
      decoratorEmail: decorator.email,
      decoratorName: decorator.name,
      serviceStatus: "Decorator-Assigned",
      trackingId: selectedBooking.trackingId,
      details: `Decorator (${decorator.name}) has been assigned for your service in ${selectedBooking.district}.`,
    };

    axiosSecure
      .patch(`/bookings/status/${selectedBooking._id}`, assignInfo)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          decoratorModalRef.current.close();
          setSelectedBooking(null);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Decorator Assigned Successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to assign decorator", "error");
      });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-base-200 pb-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-primary flex items-center gap-2 justify-center md:justify-start">
            <FaTasks /> Assign Decorators
          </h2>
          <p className="text-green-500 mt-1">
            Assign experts to paid bookings.
          </p>
        </div>
        <span className="badge badge-primary badge-lg text-white shadow-md p-4">
          Pending Tasks: {bookings.length}
        </span>
      </div>

      {/* ---------------- DESKTOP VIEW (TABLE) ---------------- */}
      <div className="hidden md:block overflow-x-auto shadow-xl rounded-xl border border-base-200 bg-base-100">
        <table className="table w-full">
          <thead className="bg-primary text-white text-base">
            <tr>
              <th>#</th>
              <th>Service Info</th>
              <th>Date & Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking._id}
                className="hover:bg-base-200/50 transition-colors"
              >
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img src={booking.service_image} alt="Service" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{booking.service_name}</div>
                      <div className="text-sm font-mono text-primary">
                        ৳{booking.service_cost}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-2 text-accent">
                      <FaCalendarAlt className="text-primary" />{" "}
                      {booking.booking_date}
                    </span>
                    <span className="flex items-center gap-2 font-bold">
                      <FaMapMarkerAlt className="text-secondary" />{" "}
                      {booking.district}
                    </span>
                    <span className="text-xs  ml-6">{booking.area}</span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span className="badge badge-warning text-white font-bold uppercase text-xs">
                      {booking.status || "Pending"}
                    </span>
                    <span className="badge badge-success badge-outline font-bold text-[10px]">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => openAssignModal(booking)}
                    className="btn btn-sm btn-primary text-white shadow-md gap-2"
                  >
                    <FaUserTie /> Find Decorator
                  </button>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-neutral/50">
                  No pending assignments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE VIEW (CARDS) ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-base-100 rounded-xl shadow-md border border-base-200 p-4 relative overflow-hidden"
          >
            {/* Status Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>

            <div className="flex gap-3 mb-3 ml-2">
              <div className="avatar">
                <div className="w-12 h-12 rounded-lg">
                  <img src={booking.service_image} alt="" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-base-content leading-tight">
                  {booking.service_name}
                </h3>
                <p className="text-xs text-primary font-bold flex items-center gap-1 mt-1">
                  <FaMoneyBillWave /> ৳{booking.service_cost}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="badge badge-xs badge-success text-white py-2 px-2 mb-1">
                  Paid
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs ml-2 mb-4 bg-base-200/50 p-2 rounded-lg">
              <div className="flex items-center gap-2 ">
                <FaCalendarAlt className="text-primary" />{" "}
                {booking.booking_date}
              </div>
              <div className="flex items-center gap-2 font-bold text-primary">
                <FaMapMarkerAlt className="text-secondary" /> {booking.district}
              </div>
            </div>

            <button
              onClick={() => openAssignModal(booking)}
              className="btn btn-primary btn-sm w-full text-white ml-1"
            >
              <FaUserTie /> Assign Decorator
            </button>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-10 text-neutral/50 bg-base-200 rounded-xl">
            No pending assignments available.
          </div>
        )}
      </div>

      {/* --- Assign Modal (Responsive) --- */}
      <dialog
        ref={decoratorModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-100 border border-base-300 w-11/12 max-w-2xl p-4 sm:p-6">
          <h3 className="font-bold text-lg sm:text-xl text-primary mb-1">
            Assign Decorator
          </h3>
          <p className="text-xs sm:text-sm  mb-4">
            Showing experts for{" "}
            <span className="font-bold text-green-400">
              {selectedBooking?.district}
            </span>{" "}
            region.
          </p>

          <div className="overflow-y-auto max-h-60 sm:max-h-80 border rounded-lg border-base-200">
            <table className="table table-zebra w-full bg-base-100">
              <thead className="bg-base-200 sticky top-0 z-10">
                <tr>
                  <th>Decorator</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {decorators.map((decorator) => (
                  <tr key={decorator._id}>
                    <td>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="avatar placeholder sm:flex">
                          <div className=" text-neutral-content rounded-full w-8 sm:w-10">
                            <img src={decorator.photoURL} alt="avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm">
                            {decorator.name}
                          </div>
                          <div className="text-[10px] sm:text-xs opacity-50">
                            {decorator.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleAssignDecorator(decorator)}
                        className="btn btn-xs btn-success text-white gap-1"
                      >
                        Assign <FaCheckCircle className="hidden sm:inline" />
                      </button>
                    </td>
                  </tr>
                ))}

                {decorators.length === 0 && !isDecoratorsLoading && (
                  <tr>
                    <td colSpan="2" className="text-center py-6">
                      <div className="text-error font-bold text-xs sm:text-sm mb-1">
                        No Decorators Found!
                      </div>
                      <p className="text-[10px] sm:text-xs text-neutral/60">
                        No approved decorator available in <br />
                        <span className="font-bold text-black">
                          "{selectedBooking?.district}"
                        </span>
                        .
                      </p>
                    </td>
                  </tr>
                )}

                {isDecoratorsLoading && (
                  <tr>
                    <td colSpan="2" className="text-center py-6">
                      <span className="loading loading-spinner text-primary loading-md"></span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-ghost hover:bg-base-200">
                Cancel
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AssignDecorator;
