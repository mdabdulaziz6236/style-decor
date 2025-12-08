import React from "react";
import useRole from "../../../hooks/useRole";
import Loading from "../../../Components/Loading/Loading";
import AdminDashboardHome from "./adminDashboardHome";
import DecoratorDashboardHome from "./decoratorDashboardHome";
import UserDashboardHome from "./userDashboardHome";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <Loading></Loading>;
  }

  if (role === "admin") {
    return <AdminDashboardHome></AdminDashboardHome>;
  } else if (role === "decorator") {
    return <DecoratorDashboardHome></DecoratorDashboardHome>;
  } else {
    return <UserDashboardHome></UserDashboardHome>;
  }
};

export default DashboardHome;
