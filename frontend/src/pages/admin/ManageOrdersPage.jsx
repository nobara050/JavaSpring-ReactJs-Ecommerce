import { useState } from "react";
import formatCurrency from "../../utils/formatCurrency";

const statusList = ["Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

const statusColor = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
  "Đang giao": "bg-blue-100 text-blue-700",
  "Hoàn thành": "bg-green-100 text-green-700",
  "Đã hủy": "bg-red-100 text-red-700",
};

const initialOrders = [
  { id: "ORD001", customerName: "Nguyễn Văn A", total: 890000, status: "Chờ xác nhận", date: "17/03/2026" },
  { id: "ORD002", customerName: "Trần Thị B", total: 1200000, status: "Đang giao", date: "16/03/2026" },
  { id: "ORD003", customerName: "Lê Văn C", total: 450000, status: "Hoàn thành", date: "15/03/2026" },
];

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (order) => {
    setEditTarget(order);
    setSelectedStatus(order.status);
  };

  const handleSave = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === editTarget.id ? { ...o, status: selectedStatus } : o
      )
    );
    setEditTarget(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Quản lý đơn hàng</h1>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">Không tìm thấy đơn hàng nào</td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{order.id}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(order)}
                      className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cap nhat trang thai */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-1">Cập nhật trạng thái</h2>
            <p className="text-sm text-gray-400 mb-5">Đơn hàng {editTarget.id}</p>
            <div className="flex flex-col gap-2 mb-6">
              {statusList.map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={selectedStatus === s}
                    onChange={() => setSelectedStatus(s)}
                    className="accent-gray-900"
                  />
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[s]}`}>{s}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;