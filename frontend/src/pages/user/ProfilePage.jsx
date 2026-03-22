import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("userUsername") || "";
  const email = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    if (!localStorage.getItem("userAccessToken")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    const rt = localStorage.getItem("userRefreshToken");
    if (rt) {
      try {
        await authService.logout(rt);
      } catch {
        /* ignore */
      }
    }
    authService.clearUserSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-medium text-gray-900">Thông tin cá nhân</h1>
      <p className="mt-1 text-sm text-gray-500">Dữ liệu từ phiên đăng nhập hiện tại</p>

      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-gray-500">Tên đăng nhập</dt>
          <dd className="mt-1 text-gray-900">{username || "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-gray-900">{email || "—"}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ProfilePage;
