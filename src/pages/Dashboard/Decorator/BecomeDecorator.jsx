import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Swal from "sweetalert2";
import { FaUserTie, FaBriefcase, FaMagic, FaAddressCard } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const BecomeDecorator = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const warehouses = useLoaderData();
  const regionsDuplicate = warehouses.map((w) => w.region);
  const regions = [...new Set(regionsDuplicate)];

  const decoratorRegion = useWatch({ control, name: "region" });

  const districtByRegion = (region) => {
    const regionDistricts = warehouses.filter((w) => w.region === region);
    const districts = regionDistricts.map((d) => d.district);
    return districts;
  };

  const handleDecoratorApplication = (data) => {
    const decoratorInfo = data;
    decoratorInfo.photoURL = user.photoURL;
    axiosSecure.post("/decorators", decoratorInfo).then((res) => {
      if (res.data.insertedId) {
        navigate("/dashboard");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Application Submitted!",
          text: "We will review your portfolio and contact you soon.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 font-display flex justify-center items-center relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl z-0"></div>

      <div className="card w-full max-w-6xl bg-base-100 shadow-2xl z-10 border border-base-300">
        <div className="card-body p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <FaUserTie className="text-3xl" />
            </div>
            <h2 className="text-4xl font-black text-primary">
              Join as a Decorator
            </h2>
            <p className="text-green-500 mt-2 max-w-2xl mx-auto">
              Showcase your creativity. Fill out the form below to become a
              verified partner.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleDecoratorApplication)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* 🟢 LEFT COLUMN: Personal Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-base-300 pb-2 mb-4">
                  <FaAddressCard className="text-primary text-xl" />
                  <h3 className="text-xl font-bold text-base-content">
                    Personal Details
                  </h3>
                </div>

                {/* Name */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.displayName}
                    {...register("name", { required: "Name is required" })}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.name ? "input-error" : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <span className="text-error text-xs mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    {...register("email", { required: "Email is required" })}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <span className="text-error text-xs mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.phone ? "input-error" : ""
                    }`}
                    placeholder="+880 1xxxxxxxxx"
                  />
                  {errors.phone && (
                    <span className="text-error text-xs mt-1">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Region & District Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label font-medium text-base-content/80">
                      Region
                    </label>
                    <select
                      {...register("region", {
                        required: "Region is required",
                      })}
                      defaultValue="Pick a Region"
                      className={`select select-bordered w-full focus:select-primary bg-base-50 ${
                        errors.region ? "select-error" : ""
                      }`}
                    >
                      <option disabled>Pick a Region</option>
                      {regions.map((r, index) => (
                        <option key={index} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <span className="text-error text-xs mt-1">
                        {errors.region.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label font-medium text-base-content/80">
                      District
                    </label>
                    <select
                      {...register("district", {
                        required: "District is required",
                      })}
                      defaultValue="Pick a District"
                      className={`select select-bordered w-full focus:select-primary bg-base-50 ${
                        errors.district ? "select-error" : ""
                      }`}
                    >
                      <option disabled>Pick a District</option>
                      {decoratorRegion &&
                        districtByRegion(decoratorRegion).map((d, index) => (
                          <option key={index} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>
                    {errors.district && (
                      <span className="text-error text-xs mt-1">
                        {errors.district.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* Address */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Full Address
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Full address is required",
                    })}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.address ? "input-error" : ""
                    }`}
                    placeholder="Street No, House No, Area..."
                  />
                  {errors.address && (
                    <span className="text-error text-xs mt-1">
                      {errors.address.message}
                    </span>
                  )}
                </div>
              </div>

              {/*  RIGHT COLUMN: Professional Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-base-300 pb-2 mb-4">
                  <FaBriefcase className="text-primary text-xl" />
                  <h3 className="text-xl font-bold text-base-content">
                    Professional Info
                  </h3>
                </div>

                {/* Specialty */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Primary Specialty
                  </label>
                  <div className="relative">
                    <FaMagic className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/40" />
                    <select
                      {...register("specialty", {
                        required: "Specialty is required",
                      })}
                      defaultValue="Select Specialty"
                      className={`select select-bordered w-full pl-10 focus:select-primary bg-base-50 ${
                        errors.specialty ? "select-error" : ""
                      }`}
                    >
                      <option disabled>Select Specialty</option>
                      <option value="Wedding">Wedding Decor</option>
                      <option value="Birthday">Birthday Parties</option>
                      <option value="Corporate">Corporate Events</option>
                      <option value="Home Interior">Home Interior</option>
                      <option value="All Rounder">All Rounder</option>
                    </select>
                  </div>
                  {errors.specialty && (
                    <span className="text-error text-xs mt-1">
                      {errors.specialty.message}
                    </span>
                  )}
                </div>

                {/* Experience */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    {...register("experience", {
                      required: "Experience years is required",
                      min: 0,
                      valueAsNumber: true
                    })}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.experience ? "input-error" : ""
                    }`}
                    placeholder="e.g. 5"
                  />
                  {errors.experience && (
                    <span className="text-error text-xs mt-1">
                      {errors.experience.message}
                    </span>
                  )}
                </div>

                {/* Portfolio */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Portfolio Link ( If Have )
                  </label>
                  <input
                    type="url"
                    {...register("portfolio")}
                    className={`input input-bordered w-full focus:input-primary bg-base-50 ${
                      errors.portfolio ? "input-error" : ""
                    }`}
                    placeholder="https://drive.google.com/..."
                  />
                  {errors.portfolio && (
                    <span className="text-error text-xs mt-1">
                      {errors.portfolio.message}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label font-medium text-base-content/80">
                    Why should we verify you?
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`textarea textarea-bordered w-full h-15 focus:textarea-primary bg-base-50 ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    placeholder="Describe your team size, capabilities, and what makes you unique..."
                  ></textarea>
                  {errors.description && (
                    <span className="text-error text-xs mt-1">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex justify-center items-center pt-6 border-t border-base-300">
              <button className="btn btn-primary lg:w-[50%] md:w-[50%] w-[70%] text-lg font-bold text-white shadow-lg hover:shadow-primary/50 transition-all duration-300">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeDecorator;
