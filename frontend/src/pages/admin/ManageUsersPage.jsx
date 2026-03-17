import { useState } from "react";

const roleColor = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-gray-100 text-gray-600",
};

const initialUsers = [
  { id: 1, fullName: "Nguyễn Văn A", email: "a@email.com", phone: "0901234567", role: "user" },
  { id: 2, fullName: "Trần Thị B", email: "b@email.com", phone: "0912345678", role: "admin" },
  { id: 3, fullName: "Lê Văn C", email: "c@email.com", phone: "0923456789", role: "user" },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Quản lý người dùng</h1>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">Không tìm thấy người dùng nào</td>
              </tr>
            ) : (
              filtered.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColor[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="text-sm text-red-400 hover:text-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc muốn xóa người dùng <span className="font-medium text-gray-900">{deleteTarget.fullName}</span> không?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Hủy</button>
              <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;