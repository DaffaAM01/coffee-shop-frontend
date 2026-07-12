import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

    const token = localStorage.getItem("admin_token");
    const admin = JSON.parse(localStorage.getItem("admin") || "null");

    if (!token || !admin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;