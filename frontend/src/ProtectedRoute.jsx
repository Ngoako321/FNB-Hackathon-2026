import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const savedUser = localStorage.getItem("linkuUser");

    if (!savedUser) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet/>;

}

export default ProtectedRoute;