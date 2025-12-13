import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEnvelope, FaArrowLeft, FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.email) {
      setValue("email", location.state.email);
    }
  }, [location, setValue]);
  console.log(location);
  const onSubmit = (data) => {
    setLoading(true);
    const email = data.email;
    resetPassword(email)
      .then(() => {
        setLoading(false);
        Swal.fire({
          title: "Email Sent!",
          text: "Check your email to reset your password.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          window.open("https://mail.google.com", "_blank");
          navigate("/auth/login");
        });
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message
          .replace("Firebase: ", "")
          .replace("auth/", "");
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/50 px-4 py-10 relative overflow-hidden font-display">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>

      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
        <div className="card-body p-8 text-center">
          {/* Icon Header */}
          <div className="mx-auto mb-6 bg-linear-to-br from-primary/10 to-secondary/10 w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-white/50 shadow-inner">
            <FaKey className="text-3xl text-primary drop-shadow-sm" />
          </div>

          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
            Forgot Password?
          </h2>
          <p className="text-base-content/70 text-sm mb-8">
            No worries! Enter your email address below and we will send you a
            link to reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="form-control text-left">
              <label className="label">
                <span className="label-text font-bold text-base-content/80">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-base-content/40" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className={`input input-bordered w-full pl-11 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <span className="text-error text-xs mt-1 font-medium ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all duration-300 transform active:scale-95"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-base-200">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-base-content/60 hover:text-primary transition-colors group"
            >
              <div className="p-1.5 rounded-full bg-base-200 group-hover:bg-primary/10 transition-colors">
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
