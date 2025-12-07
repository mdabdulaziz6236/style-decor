import React from "react";
import { NavLink } from "react-router";

const MyLink = ({ children, className, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? ` underline text-purple-500 font-bold 
             text-base sm:text-[16px] md:text-[18px] 
             px-3 py-2 rounded-lg transition-all duration-300`
          : `${className} 
             font-semibold 
             text-base sm:text-[16px] md:text-[16px] 
             px-3 py-2 rounded-lg 
             transition-all duration-300 `
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
