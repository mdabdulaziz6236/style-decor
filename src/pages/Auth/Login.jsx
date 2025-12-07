import React, { useState } from "react";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import loginImg from "../../assets/login.png";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { googleLogin, signInUser, registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = (data) => {
    console.log(data);
    registerUser(data.email, data.password).then((res)=>{
      if (res) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Register Successfully ${data.name} `,
            showConfirmButton: false,
            timer: 1000,
          });
          navigate(location?.state || "/");
        }
    })
  };
  const handleSignIn = (data) => {
    signInUser(data.email, data.password)
      .then((res) => {
        console.log(res);
        if (res) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `SignIn Successfully ${data.name} `,
            showConfirmButton: false,
            timer: 1000,
          });
          navigate(location?.state || "/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSubmit = (data) => {
    if (isLogin) {
      handleSignIn(data);
    } else {
      handleRegister(data);
    }
  };
  /* google login  */
  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Login Successfully ${result.user.displayName} `,
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="min-h-screen  flex items-center justify-center bg-base-100 p-5 font-display">
      <div className="w-full lg:w-full md:w-[70%] mx-auto max-w-5xl bg-base-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Image Section */}
        <div
          className="hidden lg:flex w-1/2 relative bg-cover bg-center items-end"
          style={{
            backgroundImage: `url(${loginImg})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="relative z-10 p-10 mb-8">
            <h2 className="text-primary text-4xl font-black leading-tight">
              Your Smart Home, <br /> Your Perfect <br /> Celebration.
            </h2>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className=" lg:w-1/2 p-8  sm:p-12 lg:p-16 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-8">
            <div className="text-3xl flex gap-5 font-bold text-base-content mb-2">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9  w-9 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>{" "}
              {isLogin ? "Welcome Back" : "Create Account"}
            </div>
            <p className="text-neutral/70 text-sm">
              {isLogin
                ? "Log in to manage your smart home and book decorations."
                : "Register to get started with StyleDecor."}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="bg-base-300 p-1 rounded-xl flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-base-100 text-base-content shadow-sm"
                  : "text-neutral/60 hover:text-base-content"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-base-100 text-base-content shadow-sm"
                  : "text-neutral/60 hover:text-base-content"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Registration Fields (Only show when Register is active) */}
            {!isLogin && (
              <>
                {/* Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Full Name
                    </span>
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl"
                  />
                  {errors.name?.type === "required" && (
                    <p className="text-red-500">Name is required.</p>
                  )}
                </div>

                {/* Image Upload Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Profile Picture
                    </span>
                  </label>
                  <input
                    {...register("photo", { required: true })}
                    type="file"
                    className="file-input file-input-bordered w-full bg-base-100 rounded-xl focus:border-primary"
                  />
                  {errors.name?.type === "required" && (
                    <p className="text-red-500">Photo is required.</p>
                  )}
                </div>
              </>
            )}

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Email
                </span>
              </label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required.</p>
              )}
              {errors.email?.type === "pattern" && (
                <p className="text-red-500">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                  })}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl pr-10"
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500">Password is required.</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500">Password must 6 character.</p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-red-500">
                    Password must include uppercase and Lowercase at least one
                    special character (e.g., !@#$%^&*)
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>

              {isLogin && (
                <div className="text-right mt-2">
                  <Link
                    to="#"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              state={location.state}
              className="btn btn-primary w-full rounded-xl text-black text-lg mt-2 font-bold"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="divider text-neutral/50 text-xs my-5">
            OR CONTINUE WITH
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline border-base-300 hover:bg-base-300 hover:border-base-300 text-base-content rounded-xl flex items-center justify-center gap-2 h-12 w-full"
          >
            <FaGoogle className="text-lg" />
            <span className="text-sm font-semibold">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
