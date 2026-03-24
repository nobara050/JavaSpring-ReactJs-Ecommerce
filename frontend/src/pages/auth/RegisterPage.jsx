import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // Backend yêu cầu username — dùng email làm username (phổ biến)
      const data = await authService.register({
        username: form.email.trim(),
        password: form.password,
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      authService.persistUserSession(data);
      await authService.persistUserSession(data);
      navigate("/");
    } catch (err) {
      if (err.status === 409) {
        setError("Email hoặc tên đăng nhập đã được sử dụng.");
      } else {
        setError("Đăng ký thất bại. Kiểm tra dữ liệu và thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900 focus:outline-none caret-transparent">Đăng ký</h1>
        <p onClick={() => navigate("/")} className="focus:outline-none caret-transparent cursor-pointer text-sm text-gray-400 mt-1">Trang chủ</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="focus:outline-none caret-transparent text-sm font-medium text-gray-700">Họ tên</label>
          <input
            type="text"
            name="fullName"
            placeholder="Tên đầy đủ"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="focus:outline-none caret-transparent text-sm font-medium text-gray-700">Email (dùng làm tên đăng nhập)</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="focus:outline-none caret-transparent text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            placeholder="0901234567"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="focus:outline-none caret-transparent text-sm font-medium text-gray-700">Mật khẩu</label>
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

        <div className="flex flex-col gap-1.5">
          <label className="focus:outline-none caret-transparent text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
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
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <p className="focus:outline-none caret-transparent text-center text-sm text-gray-400 mt-6">
        Đã có tài khoản?{" "}
        <Link to="/login" className="focus:outline-none caret-transparent text-gray-900 font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
