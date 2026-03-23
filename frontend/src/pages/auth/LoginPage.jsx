import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await authService.login(username.trim(), password);
      authService.persistUserSession(data);
      if (!remember) {
        // vẫn lưu token; "nhớ đăng nhập" có thể mở rộng sau (cookie / refresh dài hạn)
      }
      await authService.persistUserSession(data);
      navigate("/");
    } catch (err) {
      if (err.status === 401) {
        setError("Sai tên đăng nhập hoặc mật khẩu.");
      } else {
        setError("Đăng nhập thất bại. Thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Đăng nhập</h1>
        <p className="text-sm text-gray-400 mt-1">Chào mừng bạn quay trở lại</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input
            type="text"
            autoComplete="username"
            placeholder="Email hoặc username đã đăng ký"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <Link
              to="/forgot-password"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 accent-gray-900 cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
            Nhớ đăng nhập
          </label>
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

      <p className="text-center text-sm text-gray-400 mt-6">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-gray-900 font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
