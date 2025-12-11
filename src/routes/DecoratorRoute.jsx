import ForbiddenPage from "../Components/Forbidden/ForbiddenPage";
import Loading from "../components/Loading/Loading";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const DecoratorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  if (loading || roleLoading) return <Loading />;
  if (user && role === "decorator") {
    return children;
  }
  return <ForbiddenPage />;
};

export default DecoratorRoute;
