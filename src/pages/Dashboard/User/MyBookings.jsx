import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaCreditCard,
  FaEdit,
  FaTrashAlt,
  FaStar,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";
import ReviewModal from "../../../Components/Modals/ReviewModal";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // State for Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const {
    isLoading,
    data: bookings = [],
    refetch,
  } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
      return res.data;
    },
  });

  const { register, handleSubmit, reset } = useForm();

  // Handle Update Modal Data
  useEffect(() => {
    if (selectedBooking) {
      reset({
        booking_date: selectedBooking.booking_date,
        phone: selectedBooking.user_phone,
        address: selectedBooking.address || selectedBooking.full_address || "",
        note: selectedBooking.note || "",
      });
      document.getElementById("update_booking_modal").showModal();
    }
  }, [selectedBooking, reset]);

  /* Handle Delete */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/bookings/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire(
              "Cancelled!",
              "Your booking has been cancelled.",
              "success"
            );
          }
        });
      }
    });
  };

  /* Handle Update Submit */
  const onUpdateSubmit = async (data) => {
    try {
      const updateData = {
        booking_date: data.booking_date,
        full_address: data.address,
        user_phone: data.phone,
        note: data.note,
      };
      const res = await axiosSecure.patch(
        `/bookings/${selectedBooking._id}`,
        updateData
      );

      if (res.data.modifiedCount > 0) {
        refetch();
        document.getElementById("update_booking_modal").close();
        setSelectedBooking(null);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong during update!", "error");
    }
  };

  /* Handle Payment */
  const handlePayment = async (booking) => {
    const bookingInfo = {
      cost: booking.service_cost,
      bookingId: booking._id,
      userEmail: booking.user_email,
      bookingName: booking.service_name,
      trackingId: booking.trackingId,
    };
    const res = await axiosSecure.post(
      "/payment-checkout-session",
      bookingInfo
    );
    window.location.assign(res.data.url);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 min-h-screen bg-base-100">
      <h2 className="text-3xl md:text-5xl font-bold mb-8 text-primary border-b border-base-300 pb-4">
        My Bookings: {bookings.length}
      </h2>

      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:block overflow-x-auto shadow-xl rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-white text-lg">
            <tr>
              <th>#</th>
              <th>Service Info</th>
              <th>Date & Time</th>
              <th>Tracking ID</th>
              <th>Cost & Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={booking.service_image}
                          alt={booking.service_name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{booking.service_name}</div>
                      <div className="text-sm opacity-50">
                        {booking.provider_email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FaCalendarAlt className="text-primary" />
                    {booking.booking_date}
                  </div>
                </td>
                <td className="">
                  <Link
                    to={`/booking-track/${booking.trackingId}`}
                    className=" font-bold hover:underline text-blue-500 hover:text-green-500 transition-all cursor-pointer"
                  >
                    {booking.trackingId}
                  </Link>
                </td>
                <td>
                  <div className="font-bold text-lg">
                    ৳ {booking.service_cost}
                  </div>
                  <span
                    className={`badge badge-xs font-bold capitalize ${
                      booking.paymentStatus === "paid"
                        ? "badge-success text-white"
                        : "badge-warning text-white"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>

                {/* --- ACTIONS COLUMN --- */}
                <td>
                  <div className="flex justify-center items-center gap-2">
                    {/* 1. Payment Pending => Pay Button */}
                    {booking.paymentStatus === "pending" && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="btn btn-sm btn-success text-white tooltip"
                        data-tip="Pay Now"
                      >
                        <FaCreditCard />
                      </button>
                    )}

                    {/* 2.  Rate Button or Rated Badge */}
                    {booking.serviceStatus === "Completed" &&
                    booking.paymentStatus === "paid" ? (
                      !booking.isReviewed ? (
                        <button
                          onClick={() => setReviewBooking(booking)}
                          className="btn btn-sm btn-warning text-white animate-pulse tooltip"
                          data-tip="Rate Service"
                        >
                          <FaStar /> Rate
                        </button>
                      ) : (
                        <span className="badge badge-success text-white p-3 font-bold">
                          Rated ✓
                        </span>
                      )
                    ) : null}

                    {/* 3. Edit & Delete  */}
                    {booking.serviceStatus !== "Completed" && (
                      <>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn btn-sm btn-info text-white tooltip"
                          data-tip="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="btn btn-sm btn-error text-white tooltip"
                          data-tip="Cancel"
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => {
          const statusColorClass =
            booking.paymentStatus === "paid" ? "bg-success" : "bg-warning";

          return (
            <div
              key={booking._id}
              className="relative bg-base-100 rounded-xl shadow-md border border-base-200 overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColorClass}`}
              ></div>

              <div className="p-4 pl-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <img
                      src={booking.service_image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-base">
                        {booking.service_name}
                      </h3>
                      <p className="text-xs font-bold text-primary">
                        ৳ {booking.service_cost}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded text-white ${statusColorClass}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

                {/* Tracking Link */}
                <div className="mb-3">
                  <Link
                    to={`/booking-track/${booking.trackingId}`}
                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                  >
                    Tracking ID: {booking.trackingId}
                  </Link>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-base-200">
                  {/* Pay Button */}
                  {booking.paymentStatus === "pending" ? (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn btn-sm btn-success text-white h-auto py-1"
                    >
                      <FaCreditCard /> Pay
                    </button>
                  ) : booking.serviceStatus === "Completed" &&
                    !booking.isReviewed ? (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="btn btn-sm btn-warning text-white h-auto py-1 animate-pulse"
                    >
                      <FaStar /> Rate
                    </button>
                  ) : booking.isReviewed ? (
                    <button
                      disabled
                      className="btn btn-sm btn-disabled h-auto py-1"
                    >
                      Rated ✓
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-sm btn-disabled h-auto py-1"
                    >
                      Paid
                    </button>
                  )}

                  {/* Edit/Cancel Buttons */}
                  {booking.serviceStatus !== "Completed" && (
                    <>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-sm btn-info text-white h-auto py-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="btn btn-sm btn-error text-white h-auto py-1"
                      >
                        <FaTrashAlt /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Review Modal (Conditional Rendering) --- */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          refetch={refetch}
          closeModal={() => setReviewBooking(null)}
        />
      )}

      {/* --- Update Booking Modal --- */}
      <dialog
        id="update_booking_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-100 border border-base-300">
          <h3 className="font-bold text-2xl text-primary mb-6 text-center">
            Update Booking
          </h3>
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            {/* Form Inputs ... (Same as your code) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <input
                  type="date"
                  {...register("booking_date")}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                {...register("address")}
                className="textarea textarea-bordered h-20"
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <textarea
                {...register("note")}
                className="textarea textarea-bordered h-20"
              ></textarea>
            </div>

            <div className="modal-action justify-between">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("update_booking_modal").close()
                }
                className="btn btn-error text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-white">
                Update
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedBooking(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyBookings;
