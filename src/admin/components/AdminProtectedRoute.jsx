import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";

function AdminProtectedRoute({ children }) {
  const token = useSelector(selectAdminToken);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;