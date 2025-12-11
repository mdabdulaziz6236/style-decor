import React from "react";
import { Link, NavLink } from "react-router";
import MyLink from "../MyLinks/MyLink";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user);
  const links = (
    <>
      <li>
        <MyLink to="/">Home</MyLink>
      </li>
      <li>
        <MyLink to="/services">Services</MyLink>
      </li>
      <li>
        <MyLink to="/coverage">Service Coverage</MyLink>
      </li>
      <li>
        <MyLink to="/about">About</MyLink>
      </li>
      <li>
        <MyLink to="/contact">Contact</MyLink>
      </li>
      {user && (
        <li>
          <MyLink to="/dashboard">Dashboard</MyLink>
        </li>
      )}
    </>
  );
  const handleLogout = () => {
    logOut().then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Logout Successfully`,
        showConfirmButton: false,
        timer: 1000,
      });
    });
  };
  return (
    <div className="navbar bg-[#091635]   sticky top-0  z-50 shadow-lg">
      <div className="navbar-start relative  z-50">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <NavLink
          to="/"
          className="hover:underline flex justify-center items-center font-bold text-primary text-xl"
        >
          <img className="w-auto h-12" src={logo} alt="" />
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {user && user?.email ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className=" avatar">
              <div className="w-15 h-15 rounded-full">
                <img src={user.photoURL} alt={`${user.displayName}`} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box  mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/dashboard" className="justify-between">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to="/auth/login"
            className="btn btn-primary text-white font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
