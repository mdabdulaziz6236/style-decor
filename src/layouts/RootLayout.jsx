import { Outlet } from "react-router";
import Navbar from "../Components/shared/Navbar";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/Loading/Loading";

const RootLayout = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div className="max-w-7xl mx-auto bg-[#101d22]">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default RootLayout;
