import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link } from "react-router";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaTasks,
  FaHome,
} from "react-icons/fa";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";

const MyAssignedProjects = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedTask, setSelectedTask] = useState(null);
  const detailsModalRef = useRef(null);

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/assigned?email=${user?.email}`
      );
      return res.data;
    },
  });

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    detailsModalRef.current.showModal();
  };

  const handleStatusUpdate = async (id, newStatus, trackingId) => {
    const result = await Swal.fire({
      title: "Update Status?",
      text: `Change status to "${newStatus.split("_").join(" ")}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#13b6ec",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update",
    });

    if (result.isConfirmed) {
      const updateInfo = {
        serviceStatus: newStatus,
        trackingId: trackingId,
        details: `Work status updated to: ${newStatus.split("_").join(" ")}`,
      };

      try {
        const res = await axiosSecure.patch(
          `/bookings/decorator-status/${id}`,
          updateInfo
        );
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire("Updated!", "Task status has been updated.", "success");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display text-base-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-base-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-primary flex items-center gap-2">
            <FaTasks /> My Assigned Tasks
          </h2>
          <p className="text-base-content/70 mt-1 font-medium">
            Manage your work schedule.
          </p>
        </div>
        <span className="badge badge-secondary badge-lg text-white shadow-md p-4 font-bold">
          Active Tasks: {tasks.length}
        </span>
      </div>

      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:block overflow-x-auto shadow-xl rounded-xl border border-base-200 bg-base-100">
        <table className="table w-full">
          <thead className="bg-primary text-white text-base">
            <tr>
              <th>#</th>
              <th>Service Info</th>
              <th>Customer Details</th>
              <th>Date & Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={task._id}
                className="hover:bg-base-200/50 transition-colors border-b border-base-200"
              >
                <th className="font-bold">{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img src={task.service_image} alt="Service" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-base-content">
                        {task.service_name}
                      </div>
                      <div className="text-xs text-blue-600 hover:text-green-600 font-bold mt-1">
                        <Link to={`/services/${task.service_id}`}>
                          View Service Page
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-2 font-bold text-base-content">
                      <FaUser className="text-primary" /> {task.user_name}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-medium text-base-content/70">
                      <MdOutlineMarkEmailUnread className="text-primary" />{" "}
                      {task.user_email}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-medium text-base-content/70">
                      <FaPhoneAlt className="text-primary" />{" "}
                      {task.user_phone || "N/A"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-2 font-medium text-base-content/80">
                      <FaCalendarAlt className="text-secondary" />{" "}
                      {task.booking_date}
                    </span>
                    <span className="flex items-center gap-2 font-medium text-base-content/80">
                      <FaMapMarkerAlt className="text-secondary" />{" "}
                      {task.district}
                    </span>
                    <button
                      onClick={() => openDetailsModal(task)}
                      className="flex items-center text-blue-600 hover:text-green-600 gap-1  font-bold text-xs bg-blue-100 px-2 py-1 rounded w-fit"
                    >
                      <AiOutlineEye /> View Details
                    </button>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge text-white font-bold text-xs py-3 ${
                      task.serviceStatus === "Completed"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {task.serviceStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="select select-bordered select-sm w-full max-w-xs focus:select-primary bg-base-100 text-base-content"
                    defaultValue={task.serviceStatus}
                    onChange={(e) =>
                      handleStatusUpdate(
                        task._id,
                        e.target.value,
                        task.trackingId
                      )
                    }
                    disabled={task.serviceStatus === "Completed"}
                  >
                    <option disabled>Change Status</option>
                    <option value="Decorator_Assigned">Assigned</option>
                    <option value="Decorator_Accepted">Accept</option>
                    <option value="Decorator_Planing">Planing Phase</option>
                    <option value="Materials_Prepared">
                      Materials Prepared
                    </option>
                    <option value="On_The_Way_To_Venue">
                      On the Way to Venue
                    </option>
                    <option value="Working">Working</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE VIEW (High Contrast Cards) ---------------- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 relative overflow-hidden"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-2 ${
                task.serviceStatus === "Completed" ? "bg-success" : "bg-warning"
              }`}
            ></div>

            <div className="flex gap-3 mb-4 ml-3">
              <div className="avatar">
                <div className="w-14 h-14 rounded-lg bg-base-200 border border-base-300">
                  <img src={task.service_image} alt="" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-lg text-base-content truncate">
                  {task.service_name}
                </h3>
                <p className="text-sm text-base-content/70 mt-1 flex items-center gap-1 font-medium">
                  <FaUser className="text-primary text-xs" /> {task.user_name}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="ml-3 mb-3">
              <span
                className={`badge text-white font-bold py-3 px-4 w-full ${
                  task.serviceStatus === "Completed"
                    ? "badge-success"
                    : "badge-warning"
                }`}
              >
                Status: {task.serviceStatus.replace("-", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm ml-3 mb-4 bg-base-200 p-3 rounded-lg border border-base-300">
              <div className="flex items-center gap-2 font-medium text-base-content">
                <FaCalendarAlt className="text-primary" />
                <span className="opacity-80">Date: {task.booking_date}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-base-content">
                <FaMapMarkerAlt className="text-secondary" />
                <span className="opacity-80">Loc: {task.district}</span>
              </div>
            </div>

            <div className="flex gap-2 ml-3">
              <button
                onClick={() => openDetailsModal(task)}
                className="btn btn-sm btn-outline btn-info flex-1 font-bold"
              >
                <AiOutlineEye /> Details
              </button>

              <select
                className="select select-bordered select-sm flex-1 focus:select-primary bg-base-100 text-base-content font-medium"
                defaultValue={task.serviceStatus}
                onChange={(e) =>
                  handleStatusUpdate(task._id, e.target.value, task.trackingId)
                }
                disabled={task.serviceStatus === "Completed"}
              >
                <option disabled>Changed Status</option>
                <option disabled value="Decorator_Assigned">
                  Assigned
                </option>
                <option value="Decorator_Accepted">Accept</option>
                <option value="Decorator_Planing">Planing Phase</option>
                <option value="Materials_Prepared">Materials Prepared</option>
                <option value="On_The_Way_To_Venue">On the Way to Venue</option>
                <option value="Working">Working</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* --- TASK DETAILS MODAL  --- */}
      <dialog
        ref={detailsModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-100 mx-auto border border-base-300 w-11/12 max-w-2xl text-base-content">
          <h3 className="font-black text-2xl text-primary border-b border-base-300 pb-3 mb-5">
            Task Details
          </h3>

          {selectedTask && (
            <div className="space-y-5">
              {/* Service Info Box */}
              <div className="bg-base-200 p-4 rounded-xl flex gap-4 items-center border border-base-300">
                <img
                  src={selectedTask.service_image}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover border border-base-300"
                />
                <div>
                  <h4 className="font-bold text-xl text-base-content">
                    {selectedTask.service_name}
                  </h4>
                  <p className="text-sm text-base-content/70 font-mono mt-1 bg-base-100 px-2 py-1 rounded inline-block">
                    ID: {selectedTask.trackingId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Info */}
                <div className="border border-base-300 p-4 rounded-xl bg-base-100">
                  <h5 className="font-bold text-sm text-primary uppercase mb-3 tracking-wider">
                    Customer Info
                  </h5>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-base font-medium">
                      <FaUser className="text-secondary" />{" "}
                      {selectedTask.user_name}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-base-content/80">
                      <MdOutlineMarkEmailUnread className="text-secondary" />{" "}
                      {selectedTask.user_email}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-base-content/80">
                      <FaPhoneAlt className="text-secondary" />{" "}
                      {selectedTask.user_phone || "Not Provided"}
                    </p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="border border-base-300 p-4 rounded-xl bg-base-100">
                  <h5 className="font-bold text-sm text-primary uppercase mb-3 tracking-wider">
                    Location & Time
                  </h5>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <FaCalendarAlt className="text-secondary" />{" "}
                      {selectedTask.booking_date}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <FaMapMarkerAlt className="text-secondary" />{" "}
                      {selectedTask.area}, {selectedTask.district}
                    </p>
                    {selectedTask.full_address && (
                      <div className="flex items-start gap-2 text-xs mt-2 bg-base-200 p-2 rounded border border-base-300">
                        <FaHome className="mt-0.5 text-secondary text-base" />
                        <span className="leading-relaxed">
                          {selectedTask.full_address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Note */}
                {selectedTask.note && (
                  <div className="bg-warning/10 border border-warning/30 p-4 rounded-xl">
                    <h5 className="font-bold text-xs text-warning uppercase mb-2">
                      Customer Note
                    </h5>
                    <p className="text-sm italic text-base-content/80 font-medium">
                      {selectedTask.note}
                    </p>
                  </div>
                )}
                <div className="bg-success/10 border border-success/30 p-4 rounded-xl">
                  <h5 className="font-bold text-xs text-success uppercase mb-2">
                    Money
                  </h5>
                  <p className="text-sm italic text-base-content/80 font-medium">
                    {selectedTask.service_cost}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn btn-primary text-white w-full md:w-auto px-8">
                Close Details
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyAssignedProjects;
