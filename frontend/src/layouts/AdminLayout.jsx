import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar.jsx";

const AdminLayout = () => {
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