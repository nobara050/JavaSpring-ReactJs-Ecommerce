import { useState } from "react";
import formatCurrency from "../../utils/formatCurrency";

const initialProducts = [
  { id: 1, name: "Classic Leather Sneaker", price: 890000, stock: 50 },
  { id: 2, name: "Running Shoe Pro", price: 1200000, stock: 30 },
  { id: 3, name: "Casual Canvas", price: 450000, stock: 100 },
];

const ManageProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", price: "", stock: "" });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditTarget(product);
    setForm({ name: product.name, price: product.price, stock: product.stock });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm({ name: "", price: "", stock: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? { ...p, name: form.name, price: Number(form.price), stock: Number(form.stock) }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), name: form.name, price: Number(form.price), stock: Number(form.stock) },
      ]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Quản lý sản phẩm</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
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
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Không tìm thấy sản phẩm nào</td>
              </tr>
            ) : (
              filtered.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(product)} className="text-sm text-blue-500 hover:text-blue-700 transition-colors">Sửa</button>
                      <button onClick={() => setDeleteTarget(product)} className="text-sm text-red-400 hover:text-red-600 transition-colors">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal them/sua */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-5">
              {editTarget ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <input type="text" name="name" placeholder="Nhập tên sản phẩm" value={form.name} onChange={handleChange} required autoFocus className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                <input type="number" name="price" placeholder="Nhập giá" value={form.price} onChange={handleChange} required min={0} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tồn kho</label>
                <input type="number" name="stock" placeholder="Nhập số lượng" value={form.stock} onChange={handleChange} required min={0} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">{editTarget ? "Lưu" : "Thêm"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xac nhan xoa */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc muốn xóa sản phẩm <span className="font-medium text-gray-900">{deleteTarget.name}</span> không?
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

export default ManageProductsPage;