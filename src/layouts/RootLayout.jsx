import { Outlet } from "react-router";
import Navbar from "../Components/shared/Navbar";


const RootLayout = () => {
  return (
    <div className="max-w-7xl mx-auto bg-[#101d22]">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;
