import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: goi API dang nhap
    console.log({ email, password, remember });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">

        {/* Logo / Ten shop */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Đăng nhập</h1>
          <p className="text-sm text-gray-400 mt-1">Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-gray-900 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-500 cursor-pointer"
            >
              Nhớ đăng nhập
            </label>
          </div>

          {/* Nut dang nhap */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Đăng nhập
          </button>

        </form>

        {/* Chuyen sang dang ky */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;