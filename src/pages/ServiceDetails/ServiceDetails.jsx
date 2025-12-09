import React, { useEffect } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useLocation,
} from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaClock,
  FaCheckCircle,
  FaTag,
  FaUserTie,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";

const ServiceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const locations = useLoaderData(); // Router থেকে লোকেশন ডাটা
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  // ১. সার্ভিস ডাটা লোড করা
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/services/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const selectedRegion = useWatch({ control, name: "region" });
  const selectedDistrict = useWatch({ control, name: "district" });
  const regions = [...new Set(locations.map((L) => L.region))];

  // Filtered Districts based on Region
  const districts = locations.filter((L) => L.region === selectedRegion);

  // Filtered Areas based on District
  const currentDistrictData = locations.find(
    (L) => L.district === selectedDistrict
  );
  const areas = currentDistrictData ? currentDistrictData.covered_area : [];

  // Reset fields when parent selection changes
  useEffect(() => {
    setValue("district", "");
    setValue("area", "");
  }, [selectedRegion, setValue]);

  useEffect(() => {
    setValue("area", "");
  }, [selectedDistrict, setValue]);

  // --- BOOKING HANDLER ---
  const handleBooking = async (data) => {
    const bookingData = {
      service_id: service._id,
      service_name: service.service_name,
      service_image: service.image,
      provider_email: service.createdByEmail,
      user_email: user?.email,
      user_name: user?.displayName,
      service_cost: service.cost,
      booking_date: data.date,
      region: data.region,
      district: data.district,
      area: data.area,
      full_address: data.address,
      note: data.note, 
      createdAt: new Date(),
      status: "pending",
      paymentStatus: "pending",
    };
    try {
      const res = await axiosSecure.post("/bookings", bookingData);
      if (res.data.insertedId) {
        document.getElementById("booking_modal").close();
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking Request Sent!",
          text: "Wait for admin approval.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      if (error) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  const openBookingModal = () => {
    if (user && user?.email) {
      document.getElementById("booking_modal").showModal();
    } else {
      Swal.fire({
        title: "Please Login",
        text: "You need to login to book a service.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed)
          navigate("/login", { state: { from: location } });
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-100 font-display py-12 px-4 md:px-12 text-base-content">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/*  Left Side: Image & Provider Info */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-base-200 group">
            <img
              src={service.image}
              alt={service.service_name}
              className="w-full h-[350px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="badge badge-primary badge-lg font-bold text-white shadow-md p-4">
                {service.category}
              </span>
            </div>
          </div>

          {/* Provider Card */}
          <div className="flex items-center gap-4 bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm">
            <div className="avatar placeholder">
              <div className="bg-primary/20 flex justify-center items-center text-primary rounded-full w-14">
                <FaUserTie className="text-2xl" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold uppercase tracking-widest">
                Service Provider
              </p>
              <p className="text-sm text-white font-medium">
                {service.createdByEmail}
              </p>
            </div>
          </div>
        </div>

        {/*  Right Side: Details Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`badge ${
                  service.service_type === "On-site"
                    ? "badge-accent"
                    : "badge-secondary"
                } badge-outline font-bold uppercase tracking-wider`}
              >
                {service.service_type}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-primary mb-4 leading-tight">
              {service.service_name}
            </h1>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-base-content">
                ৳ {service.cost}
              </span>
              <span className="text-lg font-medium text-white mb-1 capitalize">
                / {service.unit}
              </span>
            </div>
          </div>

          <div className="divider before:bg-base-300 after:bg-base-300"></div>

          <div>
            <h3 className="text-xl font-bold mb-3 text-base-content">
              Description
            </h3>
            <p className="text-gray-500 leading-relaxed text-lg text-justify">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <div className="flex items-center gap-2 mb-1 text-secondary">
                <FaClock />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Duration
                </span>
              </div>
              <p className="text-lg font-bold">{service.duration}</p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <div className="flex items-center gap-2 mb-1 text-secondary">
                <FaTag />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Category
                </span>
              </div>
              <p className="text-lg font-bold">{service.category}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Features Included</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.features?.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 bg-base-200/50 p-3 rounded-lg border border-base-200 hover:border-primary/30 transition-colors"
                >
                  <FaCheckCircle className="text-success shrink-0" />
                  <span className="text-base-content/80 font-medium text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <button
              onClick={openBookingModal}
              className="btn btn-primary w-full btn-lg rounded-xl text-white font-bold shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2"
            >
              <FaMoneyBillWave /> Book Service Now
            </button>
            <p className="text-center text-xs text-neutral/40 mt-3">
              *Payment will be collected after admin approval.
            </p>
          </div>
        </div>
      </div>

      {/*  BOOKING MODAL */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 border border-base-300 w-11/12 mx-auto max-w-3xl">
          <h3 className="font-bold text-2xl text-primary text-center mb-6">
            Finalize Booking
          </h3>

          <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
            {/* 1. User Info (Read Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Your Name</span>
                </label>
                <input
                  type="text"
                  defaultValue={user?.displayName}
                  readOnly
                  className="input input-bordered w-full  text-white cursor-not-allowed"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Your Email</span>
                </label>
                <input
                  type="text"
                  defaultValue={user?.email}
                  readOnly
                  className="input input-bordered w-full  text-white cursor-not-allowed"
                />
              </div>
            </div>

            {/* 2. Location Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Region */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Select Region*</span>
                </label>
                <select
                  {...register("region", { required: "Region is required" })}
                  className={`select select-bordered w-full ${
                    errors.region ? "select-error" : ""
                  }`}
                >
                  <option value="">Select a Region</option>
                  {regions.map((r, i) => (
                    <option key={i} value={r}>
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

              {/* District */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Select District*</span>
                </label>
                <select
                  {...register("district", {
                    required: "District is required",
                  })}
                  className={`select select-bordered w-full ${
                    errors.district ? "select-error" : ""
                  }`}
                  disabled={!selectedRegion}
                >
                  <option value="">Select a District</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <span className="text-error text-xs mt-1">
                    {errors.district.message}
                  </span>
                )}
              </div>

              {/* Area */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Select Area*</span>
                </label>
                <select
                  {...register("area", { required: "Area is required" })}
                  className={`select select-bordered w-full ${
                    errors.area ? "select-error" : ""
                  }`}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select your area.</option>
                  {areas.map((a, i) => (
                    <option key={i} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <span className="text-error text-xs mt-1">
                    {errors.area.message}
                  </span>
                )}
              </div>
            </div>

            {/* 3. Date & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Service Date*</span>
                </label>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className={`input input-bordered text-white w-full ${
                    errors.date ? "input-error" : ""
                  }`}
                />
                {errors.date && (
                  <span className="text-error text-xs mt-1">
                    {errors.date.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Address Details*</span>
                </label>
                <input
                  type="text"
                  {...register("address", {
                    required: "Full address is required",
                  })}
                  className={`input input-bordered w-full ${
                    errors.address ? "input-error" : ""
                  }`}
                  placeholder="Road No, House No, Flat No..."
                />
                {errors.address && (
                  <span className="text-error text-xs mt-1">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>

            {/* 4. Note Field  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold flex items-center gap-2">
                  <FaEdit /> Additional Note (Optional)
                </span>
              </label>
              <textarea
                {...register("note")}
                className="textarea w-full textarea-bordered h-20 focus:textarea-primary"
                placeholder="Any specific instructions or requests for the decorator..."
              ></textarea>
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                onClick={() => document.getElementById("booking_modal").close()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-white px-8">
                Confirm & Book
              </button>
            </div>
          </form>
        </div>

        {/* Close on backdrop click */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ServiceDetails;
