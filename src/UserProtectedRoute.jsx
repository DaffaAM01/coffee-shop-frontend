import { Navigate, Outlet } from "react-router-dom";

function UserProtectedRoute() {

    const token = localStorage.getItem("user_token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default UserProtectedRoute;