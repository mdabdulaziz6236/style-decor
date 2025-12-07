import React from "react";
import { NavLink } from "react-router"; // react-router-dom ব্যবহার করা ভালো

const MyLink = ({ children, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `text-primary  font-semibold 
              rounded-lg  mx-3 shadow-md transform scale-105`
          : `text-white font-medium px-4 py-2 rounded-lg 
             hover:text-primary hover:bg-white/5 `
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
