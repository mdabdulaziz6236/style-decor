import React, { useState } from "react";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import loginImg from "../../assets/login.png";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxios from "../../hooks/useAxios";


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const simpleAxios = useAxios()
  const { googleLogin, signInUser, registerUser, updateUserProfile } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const from = location.state?.from?.pathname || "/";
  /* REGISTER HANDLER */
  const handleRegister = async (data) => {
    try {
      // 1. Create User
      await registerUser(data.email, data.password)

      // 2. Prepare Image Upload
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const image_hosting_key = import.meta.env.VITE_image_host_key;
      const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

      const res = await axios.post(image_hosting_api, formData);

      if (res.data.success) {
        const photoURL = res.data.data.url;
        const updateProfile = {
          displayName: data.name,
          photoURL: photoURL,
        };
        // 3. Update Profile in firebase
        await updateUserProfile(updateProfile);
        /* save user info in mongodb */
        const userInfo = {
          email: data.email,
          displayName: data.name,
          photoURL: photoURL,
        };
        const dbRes = await simpleAxios.post("/users", userInfo);
        if (dbRes.data.insertedId) {
        
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Welcome  ${data.name}!`,
            showConfirmButton: false,
            timer: 1500,
          });

         navigate(from, { replace: true });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  /* LOGIN HANDLER */
  const handleSignIn = (data) => {
    signInUser(data.email, data.password)
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Welcome! Sign in successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
       navigate(from, { replace: true });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };

  const onSubmit = (data) => {
    isLogin ? handleSignIn(data) : handleRegister(data);
  };

  /* GOOGLE LOGIN */
  const handleGoogleLogin = () => {
    googleLogin()
      .then(async (result) => {
        /* user info save in database */
        const user = result.user;
        const userInfo = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        };
        await simpleAxios.post("/users", userInfo);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Welcome ${result.user.displayName}`,
          showConfirmButton: false,
          timer: 1000,
        });
        navigate(from, { replace: true });
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-5">
      <div className="w-full max-w-5xl bg-base-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT IMAGE SECTION */}
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${loginImg})` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="relative z-10 p-10 mb-8">
            <h2 className="text-primary text-4xl font-black leading-tight">
              Your Smart Home, <br /> Your Perfect <br /> Celebration.
            </h2>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          {/* HEADER */}
          <div className="mb-8">
            <div className="text-3xl flex gap-3 font-bold mb-2">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>
              {isLogin ? "Welcome Back" : "Create Account"}
            </div>
            <p className="text-neutral/70 text-sm">
              {isLogin
                ? "Log in to manage your smart home and book decorations."
                : "Register to get started with StyleDecor."}
            </p>
          </div>

          {/* TOGGLE BUTTONS */}
          <div className="bg-base-300 p-1 rounded-xl flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm text-primary font-semibold ${
                isLogin ? "bg-base-100 shadow" : "text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm text-primary font-semibold ${
                !isLogin ? "bg-base-100 shadow" : "text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* REGISTER ONLY FIELDS */}
            {!isLogin && (
              <>
                {/* NAME */}
                <div>
                  <label className="label-text font-medium">Full Name</label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full bg-base-100 rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">Name is required.</p>
                  )}
                </div>

                {/* PHOTO */}
                <div>
                  <label className="label-text font-medium">
                    Profile Picture
                  </label>
                  <input
                    {...register("photo", { required: true })}
                    type="file"
                    className="file-input file-input-bordered w-full"
                  />
                  {errors.photo && (
                    <p className="text-red-500 text-sm">Photo is required.</p>
                  )}
                </div>
              </>
            )}

            {/* EMAIL */}
            <div>
              <label className="label-text font-medium">Email</label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-xl"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500 text-sm">Email is required.</p>
              )}
              {errors.email?.type === "pattern" && (
                <p className="text-red-500 text-sm">Invalid email format.</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="label-text font-medium">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/60"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>

              {/* Password Errors */}
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm">Password is required.</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm">
                  Password must be at least 6 characters.
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-sm">
                  Must include uppercase, lowercase, number & special character.
                </p>
              )}

              {isLogin && (
                <div className="text-right mt-1">
                  <Link className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full text-lg font-bold rounded-xl">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* SOCIAL DIVIDER */}
          <div className="divider text-xs my-5">OR CONTINUE WITH</div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline rounded-xl w-full flex gap-2"
          >
            <FaGoogle className="text-lg" />
            <span className="font-semibold">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
