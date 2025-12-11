import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import {
  FaEdit,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserCircle,
  FaCamera,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import bgImg from "../../assets/login.png";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser = {}, refetch } = useQuery({
    queryKey: ["userProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const openEditModal = () => {
    reset({
      name: dbUser?.name || user?.displayName || "",
      phone: dbUser?.phone || "",
      address: dbUser?.address || "",
    });

    document.getElementById("edit_profile_modal").showModal();
  };

  const onSubmit = async (data) => {
    try {
      let photoURL = dbUser?.photoURL || user?.photoURL;

      if (data.photoURL && data.photoURL.length > 0) {
        const formData = new FormData();
        formData.append("image", data.photoURL[0]);
        const image_hosting_key = import.meta.env.VITE_image_host_key;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const res = await axios.post(image_hosting_api, formData);

        if (res.data.success) {
          photoURL = res.data.data.url;
        }
      }

      const updateInfo = {
        name: data.name || dbUser?.displayName,
        phone: data.phone || dbUser?.phone,
        address: data.address || dbUser?.address,
        photoURL: photoURL,
      };
      const dbRes = await axiosSecure.patch(
        `/users/${user?.email}`,
        updateInfo
      );

      if (dbRes.data.acknowledged) {
        const updateProfileInfo = {
          displayName: data.name,
          photoURL: photoURL,
        };
        await updateUserProfile(updateProfileInfo);
        refetch();
        document.getElementById("edit_profile_modal").close();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Profile Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      document.getElementById("edit_profile_modal").close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong during update!",
      });
    }
  };
  const handleCloseModal = () => {
    document.getElementById("edit_profile_modal").close();
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 font-display">
      {/* Profile Card Container */}
      <div className="max-w-4xl mx-auto bg-base-100 shadow-2xl rounded-2xl overflow-hidden border border-base-200">
        {/* Cover Photo */}
        <div className="relative h-33 md:h-48">
          <div
            className="absolute inset-0 opacity-50 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImg})` }}
          ></div>
          <div className="absolute inset-0 bg-linear-to-t from-base-100 to-transparent"></div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 md:px-10 pb-8">
          {/* Avatar & Action Button */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-12 mb-6">
            <div className="relative">
              <div className="avatar online">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-base-100 shadow-lg bg-base-200 overflow-hidden">
                  {dbUser?.photoURL || user?.photoURL ? (
                    <img
                      src={dbUser?.photoURL || user?.photoURL}
                      alt="Profile"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-neutral/30" />
                  )}
                </div>
              </div>
              <span className="absolute bottom-2 right-2 badge badge-primary badge-lg font-bold shadow-md uppercase text-black">
                {role}
              </span>
            </div>

            {/* Edit Button - Opens Modal */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={openEditModal}
                className="btn btn-primary px-6 rounded-full shadow-lg hover:shadow-primary/50 text-white"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>

          {/* User Name & Bio */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-base-content mb-1">
              {dbUser?.name || user?.displayName || "User Name"}
            </h1>
            <p className="text-pink-500 text-lg font-medium">
              Member since{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).getFullYear()
                : "2024"}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info Card */}
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h3 className="card-title text-primary text-lg mb-4 border-b border-base-300 pb-2">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-xs text-neutral/50 font-bold uppercase">
                        Email
                      </p>
                      <p className="text-base-content font-medium break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <FaPhoneAlt />
                    </div>
                    <div>
                      <p className="text-xs text-neutral/50 font-bold uppercase">
                        Phone
                      </p>
                      <p
                        className={`text-base-content font-medium ${
                          !dbUser?.phone && "italic text-neutral/40"
                        }`}
                      >
                        {dbUser?.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-xs text-neutral/50 font-bold uppercase">
                        Location
                      </p>
                      <p
                        className={`text-base-content font-medium ${
                          !dbUser?.address && "italic text-neutral/40"
                        }`}
                      >
                        {dbUser?.address || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status / Stats Card */}
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h3 className="card-title text-primary text-lg mb-4 border-b border-base-300 pb-2">
                  Account Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-base-100 p-4 rounded-xl text-center border border-base-300">
                    <div className="text-3xl font-black text-primary">0</div>
                    <div className="text-xs text-green-500 font-bold uppercase mt-1">
                      Bookings
                    </div>
                  </div>
                  <div className="bg-base-100 p-4 rounded-xl text-center border border-base-300">
                    <div className="text-3xl font-black text-secondary">0</div>
                    <div className="text-xs text-green-500 font-bold uppercase mt-1">
                      Reviews
                    </div>
                  </div>
                  <div className="col-span-2 bg-base-100 p-4 rounded-xl flex justify-between items-center border border-base-300">
                    <span className="text-sm font-bold text-white">
                      Account Status
                    </span>
                    <span className="badge badge-success text-white font-bold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  EDIT PROFILE MODAL */}
      <dialog
        id="edit_profile_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-base-100 border border-base-300">
          <h3 className="font-bold text-2xl text-primary mb-6 text-center">
            Update Profile
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="Your Name"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Photo URL Input  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Profile Picture </span>
              </label>

              <input
                type="file"
                {...register("photoURL", { required: false })}
                className="file-input file-input-bordered w-full focus:input-primary"
              />

              <label className="label">
                <span className="label-text-alt text-pink-300">
                  Leave empty to keep existing photo
                </span>
              </label>
            </div>

            {/* Phone Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                type="tel"
                {...register("phone", { required: "Phone number is required" })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="+880 1xxxxxxxxx"
              />
              {errors.phone && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* Address Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Address</span>
              </label>
              <input
                {...register("address", { required: "Address is required" })}
                className="input input-bordered w-full focus:textarea-primary"
                placeholder="Enter your location..."
              ></input>
              {errors.address && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-ghost hover:bg-base-200"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary text-white px-6">
                Update Changes
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Profile;
