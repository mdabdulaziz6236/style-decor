import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaCreditCard,
  FaEdit,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaDollarSign,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading/Loading";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedBooking) {
      reset({
        booking_date: selectedBooking.booking_date,
        phone: selectedBooking.user_phone,
        address: selectedBooking.address || selectedBooking.full_address || "",
        note: selectedBooking.note || selectedBooking.note || "",
      });
      document.getElementById("update_booking_modal").showModal();
    }
  }, [selectedBooking, reset]);

  /* Handle Delete Booking */
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
  /* Handle Update Booking Submission */
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong during update!",
      });
    }
  };
  const handlePayment = async(booking) => {
    const bookingInfo = {
      cost: booking.service_cost,
      bookingId: booking._id,
      userEmail: booking.user_email,
      bookingName: booking.service_name,
      trackingId:booking.trackingId
    }
    const res = await axiosSecure.post('/payment-checkout-session',bookingInfo)
    window.location.assign(res.data.url)
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">
        My Bookings: {bookings.length}
      </h2>

      {/* ---------------- DESKTOP VIEW (Table) ---------------- */}
      <div className="hidden md:block overflow-x-auto shadow-xl rounded-lg">
        <table className="table table-zebra w-full bg-base-100">
          <thead className="bg-primary text-white text-lg">
            <tr>
              <th>#</th>
              <th>Service Info</th>
              <th>Date & Time</th>
              <th>Tracking ID</th>
              <th>Payment & Cost</th>
              <th>Actions</th>
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
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    {booking.booking_date}
                  </div>
                </td>
                <td
                  className="max-w-[200px] font-bold truncate"
                  title={booking.trackingId}
                >
                  <Link
                    to={`/booking-track/${booking.trackingId}`}
                    className="text-primary hover:underline hover:text-green-500 block w-full"
                  >
                    {booking.trackingId}
                  </Link>
                </td>

                <td>
                  <div className="font-bold text-lg flex items-center">
                    ৳ {booking.service_cost}
                  </div>
                  <span
                    className={`badge badge-sm font-bold capitalize ${
                      booking.paymentStatus === "paid"
                        ? "badge-success text-white"
                        : "badge-warning text-white"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="flex space-x-2">
                  {/* Pay Button (Only if pending) */}
                  {booking.paymentStatus === "pending" && (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn btn-sm btn-success text-white tooltip"
                      data-tip="Pay Now"
                    >
                      <FaCreditCard />
                    </button>
                  )}

                  {/* Update Button */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="btn btn-sm btn-info text-white tooltip"
                    data-tip="Update Booking"
                  >
                    <FaEdit />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="btn btn-sm btn-error text-white tooltip"
                    data-tip="Cancel Booking"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE VIEW (Cards) ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => {
          const statusColorClass =
            booking.paymentStatus === "paid" ? "bg-success" : "bg-warning";

          return (
            <div
              key={booking._id}
              className="relative bg-base-100 rounded-xl shadow-md border border-base-200 overflow-hidden"
            >
              {/* 1. Status Color Strip (Left Side) */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColorClass}`}
              ></div>

              <div className="p-4 pl-6">
                {/* Header: Service Name & Cost */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={booking.service_image} alt="" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-base-content leading-tight">
                        {booking.service_name}
                      </h3>
                      <p className="text-xs text-white">
                        ৳ {booking.service_cost}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide text-white ${statusColorClass}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

                {/* 2. Info Grid (Date & Location) */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-white bg-base-200/50 p-2 rounded-lg">
                    <FaCalendarAlt className="text-primary text-xs" />
                    <span className="font-medium truncate">
                      {booking.booking_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white bg-base-200/50 p-2 rounded-lg">
                    <span className="font-medium truncate">
                      <Link
                        to={`/booking-track/${booking.trackingId}`}
                        className="text-primary hover:underline hover:text-green-500 block w-full"
                      >
                        {booking.trackingId}
                      </Link>
                    </span>
                  </div>
                </div>

                {/* 3. Action Buttons Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-base-200">
                  {booking.paymentStatus === "pending" ? (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn btn-sm btn-success w-full text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                    >
                      <FaCreditCard />
                      <span className="text-[9px] mt-0.5">Pay</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-sm btn-disabled w-full rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                    >
                      <FaCreditCard />
                      <span className="text-[9px] mt-0.5">Paid</span>
                    </button>
                  )}

                  {/* Update Button (Mobile) - Triggers Modal */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="btn btn-sm btn-info w-full text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <FaEdit />
                    <span className="text-[9px] mt-0.5">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="btn btn-sm btn-error text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <FaTrashAlt />
                    <span className="text-[9px] mt-0.5">Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {bookings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No bookings found.</p>
            <Link to="/services" className="btn btn-link">
              Book a service now
            </Link>
          </div>
        )}
      </div>

      {/*  UPDATE BOOKING MODAL */}
      <dialog
        id="update_booking_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-100 border border-base-300">
          <h3 className="font-bold text-2xl text-primary mb-6 text-center">
            Update Booking
          </h3>

          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date</span>
                </label>
                <input
                  type="date"
                  {...register("booking_date", {
                    required: "Date is required",
                  })}
                  className="input input-bordered w-full focus:input-primary"
                />
                {errors.booking_date && (
                  <span className="text-error text-xs mt-1">
                    {errors.booking_date.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone is required" })}
                  className="input input-bordered w-full focus:input-primary"
                />
                {errors.phone && (
                  <span className="text-error text-xs mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  className="textarea textarea-bordered h-24 focus:textarea-primary"
                  placeholder="Update address..."
                ></textarea>
                {errors.address && (
                  <span className="text-error text-xs mt-1">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* Note */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Note</span>
                </label>
                <textarea
                  {...register("note", { required: "Note is required" })}
                  className="textarea textarea-bordered h-24 focus:textarea-primary"
                  placeholder="Update note..."
                ></textarea>
                {errors.note && (
                  <span className="text-error text-xs mt-1">
                    {errors.note.message}
                  </span>
                )}
              </div>
            </div>

            {/* Single Action Row */}
            <div className="modal-action justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  document.getElementById("update_booking_modal").close();
                }}
                className="btn bg-error text-white"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary text-white px-6">
                Update Changes
              </button>
            </div>
          </form>
        </div>

        {/* Backdrop Close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedBooking(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyBookings;
