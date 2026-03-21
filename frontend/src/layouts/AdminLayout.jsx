import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar.jsx";

const AdminLayout = () => {
  const accessToken = localStorage.getItem("adminAccessToken");

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-w-6xl bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;