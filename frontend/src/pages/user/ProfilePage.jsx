import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import userService from "../../services/userService";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("userAccessToken")) {
      navigate("/login", { replace: true });
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const accessToken = localStorage.getItem("userAccessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/account/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
      setForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        email: data.email || "",
      });
      if (data.avatar) setAvatarPreview(data.avatar);
    } catch {
      setError("Không thể tải thông tin tài khoản.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");
    try {
      const updated = await userService.uploadAvatar(file);
      setProfile(updated);
      setAvatarPreview(updated.avatar);
      setSuccessMsg("Cập nhật ảnh đại diện thành công.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Tải ảnh lên thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await userService.updateMe(form);
      setProfile(updated);
      setSuccessMsg("Cập nhật thông tin thành công.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const rt = localStorage.getItem("userRefreshToken");
    if (rt) {
      try {
        await authService.logout(rt);
      } catch { /* ignore */ }
    }
    authService.clearUserSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-5 min-w-xl">
      <h1 className="w-full flex flex-col items-center justify-center text-2xl font-bold text-gray-900 mb-8 focus:outline-none caret-transparent">Thông Tin Cá Nhân</h1>

      {error && (
        <div className="flex flex-col items-center justify-center w-full mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex flex-col items-center justify-center w-full mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {successMsg}
        </div>
      )}

      {/* Avatar */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-5 mb-4 flex items-center gap-5 justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">No image</span>
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">...</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1 focus:outline-none caret-transparent">Ảnh đại diện</p>
          <label className="cursor-pointer font-semibold text-sm text-blue-500 hover:text-blue-700 transition-colors focus:outline-none caret-transparent">
            Thay đổi ảnh
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Form thong tin */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-10 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 focus:outline-none caret-transparent flex flex-col items-center justify-center">Chỉnh sửa thông tin</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 focus:outline-none caret-transparent">Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleFormChange}
              placeholder="Nhập họ tên"
              className="focus:outline-none w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 focus:outline-none caret-transparent">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Nhập email"
              className="focus:outline-none w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium text-gray-700 focus:outline-none caret-transparent">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="Nhập số điện thoại"
              className="focus:outline-none w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex flex-col items-center justify-center w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      {/* Thong tin tai khoan */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-10 mb-4">
        <h2 className="flex flex-col items-center justify-center text-base font-semibold text-lg text-gray-900 mb-4">Thông tin tài khoản</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Tên đăng nhập</dt>
            <dd className="font-medium text-gray-900">{profile?.username || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Trạng thái</dt>
            <dd className="font-medium text-gray-900">{profile?.isActive ? "Hoạt động" : "Bị khóa"}</dd>
          </div>
        </dl>
      </div>
          
      <a
        onClick={handleLogout}
        className="cursor-pointer flex flex-col items-center justify-center w-full py-2.5 border border-gray-300 text-white rounded-lg text-sm font-medium bg-[#fc7600] mb-5">
        Đăng xuất
      </a>
    </div>
  );
};

export default ProfilePage;
