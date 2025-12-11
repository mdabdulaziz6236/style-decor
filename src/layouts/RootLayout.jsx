import { Outlet } from "react-router";
import Navbar from "../Components/shared/Navbar";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/Loading/Loading";
import Footer from "../Components/shared/Footer";

const RootLayout = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div className="max-w-7xl mx-auto ">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
