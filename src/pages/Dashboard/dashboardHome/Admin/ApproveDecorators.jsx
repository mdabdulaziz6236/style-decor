import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaBriefcase,
  FaEnvelope,
  FaEye,
  FaLink,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
  FaTrashAlt,
  FaUserCheck,
} from "react-icons/fa";
import { IoPersonRemoveSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Components/Loading/Loading";

const ApproveDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const {
    isLoading,
    data: decorators = [],
    refetch,
  } = useQuery({
    queryKey: ["decorators", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data;
    },
  });

  /* Handle Update Status (Approve/Reject) */
  const updateStatus = (decorator, status) => {
    const updateInfo = { status: status, email: decorator.email };
    axiosSecure
      .patch(`/decorators/${decorator._id}`, updateInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Application ${status} successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  /* Handle Delete */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/decorators/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire(
              "Deleted!",
              "The application has been deleted.",
              "success"
            );
          }
        });
      }
    });
  };
  if (isLoading) {
    return <Loading></Loading>;
  }
  console.log(selectedDecorator)
  return (
    <div className="p-4">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">
        Decorators Pending: {decorators.length}
      </h2>

      {/* ---------------- DESKTOP VIEW (Table) ---------------- */}
      <div className="hidden md:block overflow-x-auto shadow-xl rounded-lg">
        <table className="table table-zebra w-full bg-base-100">
          <thead className="bg-primary text-white text-lg">
            <tr>
              <th>#</th>
              <th>Name & Email</th>
              <th>Specialty</th>
              <th>Experience</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {decorators.map((decorator, index) => (
              <tr key={decorator._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="font-bold">{decorator.name}</div>
                  <div className="text-sm opacity-50">{decorator.email}</div>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm font-bold">
                    {decorator.specialty}
                  </span>
                </td>
                <td>{decorator.experience} Years</td>
                <td>{decorator.district}</td>
                <td>
                  <span
                    className={`font-bold capitalize ${
                      decorator.status === "approved"
                        ? "text-success"
                        : decorator.status === "rejected"
                        ? "text-error"
                        : "text-warning"
                    }`}
                  >
                    {decorator.status}
                  </span>
                </td>
                <td className="flex space-x-2">
                  <button
                    onClick={() => updateStatus(decorator, "approved")}
                    className="btn btn-sm btn-success text-white tooltip"
                    data-tip="Approve"
                  >
                    <FaUserCheck />
                  </button>
                  <button
                    onClick={() => updateStatus(decorator, "rejected")}
                    className="btn btn-sm btn-warning text-white tooltip"
                    data-tip="Reject"
                  >
                    <IoPersonRemoveSharp />
                  </button>
                  <button
                    onClick={() => setSelectedDecorator(decorator)}
                    className="btn btn-sm btn-info text-white tooltip"
                    data-tip="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(decorator._id)}
                    className="btn btn-sm btn-error text-white tooltip"
                    data-tip="Delete"
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
        {decorators.map((decorator) => {
          const statusColorClass =
            decorator.status === "approved"
              ? "bg-success"
              : decorator.status === "rejected"
              ? "bg-error"
              : "bg-warning";

          return (
            <div
              key={decorator._id}
              className="relative bg-base-100 rounded-xl shadow-md border border-base-200 overflow-hidden"
            >
              {/* 1. Status Color Strip (Left Side) */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColorClass}`}
              ></div>

              <div className="p-4 pl-6">
                {/* Header: Name, Email & Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-base-content">
                      {decorator.name}
                    </h3>
                    <p className="text-xs text-neutral/60 break-all">
                      {decorator.email}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide text-white ${statusColorClass}`}
                  >
                    {decorator.status}
                  </span>
                </div>

                {/* 2. Info Grid (Specialty & Location with Icons) */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-neutral/80 bg-base-200/50 p-2 rounded-lg">
                    <FaBriefcase className="text-primary text-xs" />
                    <span className="font-medium truncate">
                      {decorator.specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral/80 bg-base-200/50 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-primary text-xs" />
                    <span className="font-medium truncate">
                      {decorator.district}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral/50 mb-4 pl-1">
                  Experience:{" "}
                  <span className="text-base-content font-bold">
                    {decorator.experience} Years
                  </span>
                </div>

                {/* 3. Action Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-base-200">
                  <button
                    onClick={() => updateStatus(decorator._id, "approved")}
                    className="btn btn-sm btn-success text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <FaUserCheck />
                    <span className="text-[9px] mt-0.5">Accept</span>
                  </button>

                  <button
                    onClick={() => updateStatus(decorator._id, "rejected")}
                    className="btn btn-sm btn-warning text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <IoPersonRemoveSharp />
                    <span className="text-[9px] mt-0.5">Reject</span>
                  </button>

                  <button
                    onClick={() => setSelectedDecorator(decorator)}
                    className="btn btn-sm btn-info text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <FaEye />
                    <span className="text-[9px] mt-0.5">View</span>
                  </button>

                  <button
                    onClick={() => handleDelete(decorator._id)}
                    className="btn btn-sm btn-error text-white rounded-lg flex flex-col items-center gap-0 h-auto py-1"
                  >
                    <FaTrashAlt />
                    <span className="text-[9px] mt-0.5">Del</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {decorators.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No pending applications.
          </p>
        )}
      </div>
      {/* DETAILS MODAL */}
      {selectedDecorator && (
        <dialog id="decorator_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl">
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white relative">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-white/20 text-white rounded-full w-16">
                    <img src={selectedDecorator.photoURL} alt="" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl">
                    {selectedDecorator.name}
                  </h3>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt /> {selectedDecorator.district},{" "}
                    {selectedDecorator.region}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-xs text-base-50">Email</p>
                    <p className="font-medium text-sm break-all">
                      {selectedDecorator.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-xs text-base-50">Phone</p>
                    <p className="font-medium text-sm">
                      {selectedDecorator.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h4 className="font-bold text-lg mb-3 border-b pb-1 border-base-200">
                  Professional Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-base-50">Specialty</p>
                    <span className="badge  mt-1">
                      {selectedDecorator.specialty}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-base-50">Experience</p>
                    <p className="font-bold">
                      {selectedDecorator.experience} Years
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-lg mb-2 border-b pb-1 border-base-200">
                  About
                </h4>
                <p className="text-sm text-green-500 leading-relaxed bg-base-200/30 p-3 rounded-lg">
                  {selectedDecorator.description || "No description provided."}
                </p>
              </div>

              {/* Portfolio Link */}
              <div>
                <h4 className="font-bold text-lg mb-2 border-b pb-1 border-base-200">
                  Portfolio
                </h4>
                <a
                  href={selectedDecorator.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-primary btn-sm gap-2 w-full sm:w-auto"
                >
                  <FaLink /> View Portfolio
                </a>
              </div>

              {/* Full Address */}
              <div>
                <h4 className="font-bold text-lg mb-2 border-b pb-1 border-base-200">
                  Address
                </h4>
                <p className="text-sm text-purple-500">
                  {selectedDecorator.address}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-base-200/50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDecorator(null)}
                className="btn btn-sm"
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedDecorator(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ApproveDecorators;
