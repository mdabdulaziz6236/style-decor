import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaPinterest,
  FaFacebookF,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const Contact = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const contactInfo = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      date: new Date(),
      status: "unread",
    };

    try {
      const res = await axiosSecure.post("/contact", contactInfo);

      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Message Sent Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-display px-4 py-16 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
            Let's Create Something Beautiful Together
          </h1>
          <p className="text-purple-500 max-w-2xl mx-auto text-lg">
            We're here to help you. Reach out to us and we'll respond as soon as
            we can.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side: Contact Info */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Contact Information</h3>
              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-primary text-xl mt-1" />
                <div>
                  <p className="text-neutral/70 text-sm">Phone</p>
                  <p className="text-lg font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-primary text-xl mt-1" />
                <div>
                  <p className="text-neutral/70 text-sm">Email</p>
                  <p className="text-lg font-medium">contact@styledecor.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                <div>
                  <p className="text-neutral/70 text-sm">Address</p>
                  <p className="text-lg font-medium">
                    123 Decor St, Style City
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Follow Us</h3>
              <div className="flex gap-4">
                <button className="btn btn-square btn-outline btn-primary rounded-xl">
                  <FaInstagram />
                </button>
                <button className="btn btn-square btn-outline btn-primary rounded-xl">
                  <FaPinterest />
                </button>
                <button className="btn btn-square btn-outline btn-primary rounded-xl">
                  <FaFacebookF />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-base-200 p-8 rounded-3xl border border-base-300 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  defaultValue={user?.displayName || ""}
                  placeholder="Your Full Name"
                  {...register("name", { required: "Name is required" })}
                  className="input input-bordered w-full focus:input-primary bg-base-100"
                />
                {errors.name && (
                  <span className="text-error text-xs mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="your@email.com"
                  {...register("email", { required: "Email is required" })}
                  className="input input-bordered w-full focus:input-primary bg-base-100"
                />
                {errors.email && (
                  <span className="text-error text-xs mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <input
                  type="text"
                  placeholder="Inquiry Subject"
                  {...register("subject", { required: "Subject is required" })}
                  className="input input-bordered w-full focus:input-primary bg-base-100"
                />
                {errors.subject && (
                  <span className="text-error text-xs mt-1">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium">Message</span>
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  className="textarea textarea-bordered h-32 w-full focus:textarea-primary bg-base-100 text-base"
                  placeholder="Write your message..."
                ></textarea>
                {errors.message && (
                  <span className="text-error text-xs mt-1">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <button
                disabled={loading}
                className="btn btn-primary w-full text-white font-bold rounded-lg mt-4"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
