import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/dashboardHome/dashboardHome";
import Coverage from "../pages/Service-coverase/Coverage";
import BecomeDecorator from "../pages/Dashboard/Decorator/BecomeDecorator";
import ApproveDecorators from "../pages/Dashboard/dashboardHome/Admin/ApproveDecorators";
import PrivetRoute from "./PrivetRoute";
import ErrorPage from "../pages/eroor/ErrorPage";
import AdminRoute from "./AdminRoute";
import AddService from "../pages/Dashboard/dashboardHome/Admin/AddService";
import ServiceDetails from "../pages/ServiceDetails/ServiceDetails";
import MyBookings from "../pages/Dashboard/User/MyBookings";
import BookingTrack from "../pages/BookingTrack/BookingTrack";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "services/:id",
        loader: () => fetch("/coverage-area.json").then((res) => res.json()),
        Component: ServiceDetails,
      },
      {
        path: "coverage",
        loader: () => fetch("/coverage-area.json").then((res) => res.json()),
        element: <Coverage></Coverage>,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "booking-track/:trackingId",
        Component: BookingTrack,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "login",
        Component: Login,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRoute>
        <DashboardLayout></DashboardLayout>
      </PrivetRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "my-bookings",
        Component: MyBookings,
      },
      {
        path: "approve-decorator",
        element: (
          <AdminRoute>
            <ApproveDecorators></ApproveDecorators>
          </AdminRoute>
        ),
      },
      {
        path: "add-service",
        element: (
          <AdminRoute>
            <AddService></AddService>
          </AdminRoute>
        ),
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "decorator",
        loader: () => fetch("/coverage-area.json").then((res) => res.json()),
        Component: BecomeDecorator,
      },
    ],
  },
]);
