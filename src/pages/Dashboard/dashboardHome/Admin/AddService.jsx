import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import {
  FaUpload,
  FaHeading,
  FaLayerGroup,
  FaMoneyBillWave,
  FaClock,
  FaListUl,
  FaAlignLeft,
  FaImage,
} from "react-icons/fa";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_image_host_key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddService = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      // 1. Image Upload
      const formData = new FormData();
      formData.append("image", data.photo[0]);
      const res = await axios.post(image_hosting_api, formData);
      const imgURL = res.data.data.url;

      if (res.data.success) {
        // 2. Prepare Data
        const serviceItem = {
          service_name: data.service_name,
          category: data.category,
          service_type: data.service_type,
          cost: parseFloat(data.cost),
          unit: data.unit,
          duration: data.duration,
          features: data.features
            .split("\n")
            .filter((item) => item.trim() !== ""),
          description: data.description,
          image: imgURL,
          createdByEmail: user?.email,
          status: "active",
          rating: 0,
          added_date: new Date(),
        };

        // 3. Save to DB
        const menuRes = await axiosSecure.post("/services", serviceItem);

        if (menuRes.data.insertedId) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Service Added Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to upload image or save data!",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-100 font-display">
      <div className="max-w-5xl mx-auto bg-base-100 shadow-2xl rounded-2xl overflow-hidden border border-base-200">
        {/* Header Title */}
        <div className="bg-primary/10 p-6 md:p-10 text-center border-b border-base-200">
          <h2 className="text-3xl md:text-4xl font-black text-primary">
            Add New Service
          </h2>
          <p className="text-green-500 mt-2 text-sm md:text-base">
            Fill out the form below to create a new decoration package.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Section 1: Basic Info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaHeading className="text-primary" /> Service Name*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Wedding Stage"
                  {...register("service_name", {
                    required: "Service name is required",
                  })}
                  className={`input input-bordered w-full focus:input-primary ${
                    errors.service_name ? "input-error" : ""
                  }`}
                />
                {errors.service_name && (
                  <span className="text-error text-xs mt-1">
                    {errors.service_name.message}
                  </span>
                )}
              </div>

              {/* Service Type */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaLayerGroup className="text-primary" /> Service Type*
                  </span>
                </label>
                <select
                  defaultValue=""
                  {...register("service_type", {
                    required: "Service type is required",
                  })}
                  className={`select select-bordered w-full focus:select-primary ${
                    errors.service_type ? "select-error" : ""
                  }`}
                >
                  <option disabled value="">
                    Select Type
                  </option>
                  <option value="On-site">On-site Decoration</option>
                  <option value="Consultation">Online Consultation</option>
                </select>
                {errors.service_type && (
                  <span className="text-error text-xs mt-1">
                    {errors.service_type.message}
                  </span>
                )}
              </div>
            </div>

            {/* --- Section 2: Pricing & Category --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaListUl className="text-primary" /> Category*
                  </span>
                </label>
                <select
                  defaultValue=""
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`select select-bordered w-full focus:select-primary ${
                    errors.category ? "select-error" : ""
                  }`}
                >
                  <option disabled value="">
                    Select Category
                  </option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Home">Home Decor</option>
                </select>
                {errors.category && (
                  <span className="text-error text-xs mt-1">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* Cost */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaMoneyBillWave className="text-primary" /> Cost (BDT)*
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  {...register("cost", {
                    required: "Cost is required",
                    min: 1,
                  })}
                  className={`input input-bordered w-full focus:input-primary ${
                    errors.cost ? "input-error" : ""
                  }`}
                />
                {errors.cost && (
                  <span className="text-error text-xs mt-1">
                    {errors.cost.message}
                  </span>
                )}
              </div>
            </div>

            {/* --- Section 3: Details & Image --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unit */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Unit*</span>
                </label>
                <select
                  defaultValue="per event"
                  {...register("unit", { required: true })}
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="per event">Per Event</option>
                  <option value="per sqft">Per Sq. Ft.</option>
                  <option value="per day">Per Day</option>
                  <option value="per hour">Per Hour</option>
                  <option value="per hour">Per Room</option>
                </select>
              </div>

              {/* Duration */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaClock className="text-primary" /> Duration*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 Days"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                  className={`input input-bordered w-full focus:input-primary ${
                    errors.duration ? "input-error" : ""
                  }`}
                />
                {errors.duration && (
                  <span className="text-error text-xs mt-1">
                    {errors.duration.message}
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <FaImage className="text-primary" /> Service Image*
                  </span>
                </label>
                <input
                  type="file"
                  {...register("photo", { required: "Image is required" })}
                  className={`file-input file-input-bordered w-full file-input-primary ${
                    errors.image ? "file-input-error" : ""
                  }`}
                />
                {errors.image && (
                  <span className="text-error text-xs mt-1">
                    {errors.image.message}
                  </span>
                )}
              </div>
            </div>

            {/* --- Section 4: Text Areas --- */}

            {/* Features */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold flex items-center gap-2">
                  <FaListUl className="text-primary" /> Key Features
                </span>
                <span className="label-text-alt ">(One per line)</span>
              </label>
              <textarea
                {...register("features", {
                  required: "At least one feature is required",
                })}
                className={`textarea w-full textarea-bordered h-24 focus:textarea-primary ${
                  errors.features ? "textarea-error" : ""
                }`}
                placeholder="Free 3D Design&#10;Premium Flowers&#10;Eco-friendly materials"
              ></textarea>
              {errors.features && (
                <span className="text-error text-xs mt-1">
                  {errors.features.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold flex items-center gap-2">
                  <FaAlignLeft className="text-primary" /> Description*
                </span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className={`textarea w-full textarea-bordered h-24 focus:textarea-primary ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Write detailed description about the service..."
              ></textarea>
              {errors.description && (
                <span className="text-error text-xs mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
            {/* Submit Button */}
            <div className="pt-6">
              <button className="btn btn-primary w-full text-white text-lg font-bold shadow-lg hover:shadow-primary/40 transition-all">
                <FaUpload className="mr-2" /> Publish Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
