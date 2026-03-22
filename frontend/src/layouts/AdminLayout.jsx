import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar.jsx";
import authService from "../services/authService";

const AdminLayout = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("adminAccessToken");
  const adminName = localStorage.getItem("adminUsername") || "Admin";

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    const rt = localStorage.getItem("adminRefreshToken");
    if (rt) {
      try {
        await authService.logout(rt);
      } catch {
        /* ignore */
      }
    }
    authService.clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen min-w-6xl flex-col bg-gray-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <p className="text-sm text-gray-600">
          Đăng nhập: <span className="font-medium text-gray-900">{adminName}</span>
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Đăng xuất
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
