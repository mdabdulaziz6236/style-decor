import ForbiddenPage from "../Components/Forbidden/ForbiddenPage";
import Loading from "../Components/Loading/Loading";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  if (loading || roleLoading) return <Loading />;
  if (user && role === "admin") {
    return children;
  }
  return <ForbiddenPage />;
};

export default AdminRoute;
