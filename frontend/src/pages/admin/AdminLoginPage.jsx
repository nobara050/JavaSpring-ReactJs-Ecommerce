import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("adminAccessToken", response.accessToken);
      localStorage.setItem("adminRefreshToken", response.refreshToken);
      localStorage.setItem("adminUsername", response.username);

      navigate("/admin");
    } catch (err) {
      setError("Sai tài khoản/mật khẩu hoặc bạn không có quyền admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ background: "linear-gradient(to right, #111827, #1f2937)" }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Đăng nhập Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Dành cho quản trị hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="admin"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-60"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
