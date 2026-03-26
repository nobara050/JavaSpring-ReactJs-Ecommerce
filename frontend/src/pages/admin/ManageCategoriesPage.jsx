import { useState, useEffect } from "react";
import categoryService from "../../services/categoryService";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Loi tai danh muc:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ categoryName: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditTarget(category);
    setForm({
      categoryName: category.categoryName,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm({ categoryName: "", description: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryName.trim()) return;
    try {
      const payload = {
        categoryName: form.categoryName.trim(),
        description: form.description.trim() || null,
      };
      if (editTarget) {
        await categoryService.update(editTarget.id, payload);
      } else {
        await categoryService.create(payload);
      }
      await fetchCategories();
      closeModal();
    } catch (err) {
      console.error("Loi luu danh muc:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await categoryService.delete(id);
      await fetchCategories();
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      setError(err.message || "Không thể xóa danh mục này");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 focus:outline-none caret-transparent">
        <h1 className="text-2xl font-medium text-gray-900">Quản lý danh mục</h1>
        <button
          onClick={openAdd}
          className="focus:outline-none caret-transparent px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity"
        >
          Thêm danh mục
        </button>
      </div>

      {/* Thong bao loi */}
      {error && (
        <div className="focus:outline-none caret-transparent mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="mb-5">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <div className="focus:outline-none caret-transparent bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">Đang tải...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">Không tìm thấy danh mục nào</td>
              </tr>
            ) : (
              filtered.map((category, index) => (
                <tr key={category.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{category.categoryName}</td>
                  <td className="px-6 py-4 text-gray-500">{category.description || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(category)} className="text-sm text-blue-500 hover:text-blue-700 transition-colors">Sửa</button>
                      <button onClick={() => setDeleteTarget(category)} className="text-sm text-red-400 hover:text-red-600 transition-colors">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-5">
              {editTarget ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tên danh mục</label>
                <input
                  type="text"
                  name="categoryName"
                  placeholder="Nhập tên danh mục"
                  value={form.categoryName}
                  onChange={handleChange}
                  required
                  autoFocus
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Nhập mô tả danh mục"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">{editTarget ? "Lưu" : "Thêm"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-medium text-gray-900 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc muốn xóa danh mục <span className="font-medium text-gray-900">{deleteTarget.categoryName}</span> không?
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

export default ManageCategoriesPage;