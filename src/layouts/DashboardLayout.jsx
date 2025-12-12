import React from "react";
import {
  FaCalendarCheck,
  FaHouseUser,
  FaMoneyBillWave,
  FaRegUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { Link, Outlet } from "react-router";
import useRole from "../hooks/useRole";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { LuUserCheck } from "react-icons/lu";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import Loading from "../Components/Loading/Loading";
import logo from "../assets/logo.svg";
import { Users } from "lucide-react";

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="drawer max-w-7xl mx-auto lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4">Navbar Title</div>
        </nav>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link
                to="/"
                className="is-drawer-close:tooltip flex items-center is-drawer-close:tooltip-right"
                data-tip="Home"
              >
                <FaHouseUser className="my-1.5 inline-block size-4" />
                <img
                  src={logo}
                  className="is-drawer-close:hidden text-2xl font-black  text-primary tracking-tight"
                  alt=""
                />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Dashboard Home"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Dashboard Home</span>
              </Link>
            </li>
            <li
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Profile"
            >
              <Link to="/dashboard/profile">
                <FaRegUserCircle className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Profile</span>
              </Link>
            </li>
            {role !== "admin" && role !== "decorator" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Become Decorator"
              >
                <Link to="/dashboard/decorator">
                  <FaUserPlus className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">
                    Become Decorator
                  </span>
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Approve Decorator"
              >
                <Link to="/dashboard/approve-decorator">
                  <RiVerifiedBadgeFill className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">
                    Approve Decorator
                  </span>
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Manage Users"
              >
                <Link to="/dashboard/manage-users">
                  <Users className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">
                    Manage Users
                  </span>
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Add Service"
              >
                <Link to="/dashboard/add-service">
                  <AiOutlinePlus className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">Add Service</span>
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Assign Decorator"
              >
                <Link to="/dashboard/assign-decorator">
                  <LuUserCheck className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">
                    Assign Decorator
                  </span>
                </Link>
              </li>
            )}
            {role === "decorator" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Assigned Projects"
              >
                <Link to="/dashboard/my-assigned-projects">
                  <AiOutlineUnorderedList className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">
                    My Assigned Projects
                  </span>
                </Link>
              </li>
            )}
            {role === "decorator" && (
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Earnings"
              >
                <Link to="/dashboard/my-earnings">
                  <FaMoneyBillWave className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">My Earnings</span>
                </Link>
              </li>
            )}
            <li
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="My Bookings"
            >
              <Link to="/dashboard/my-bookings">
                <FaCalendarCheck className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">My Bookings</span>
              </Link>
            </li>
            <li
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Payment History"
            >
              <Link to="/dashboard/payment-history">
                <MdPayment className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Payment History</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
