import { useState, useEffect } from "react";
import formatCurrency from "../../utils/formatCurrency";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import discountService from "../../services/discountService";

const MAX_IMAGES = 6;

const emptyForm = {
  productName: "",
  description: "",
  price: "",
  stockQuantity: "",
  categoryIds: [],
  discountId: "",
};

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [allImages, setAllImages] = useState([]);
  // allImages: { type: "existing", id, imageUrl, isPrimary } | { type: "new", file, previewUrl, isPrimary }
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Loi tai san pham:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Loi tai danh muc:", err);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const data = await discountService.getAll();
      setDiscounts(data);
    } catch (err) {
      console.error("Loi tai discount:", err);
    }
  };

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setAllImages([]);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditTarget(product);
    setForm({
      productName: product.productName,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryIds: product.categoryList?.map((c) => c.id) || [],
      discountId: product.discount?.id || "",
    });
    setAllImages(
      (product.productImageList || []).map((img) => ({
        type: "existing",
        id: img.id,
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      }))
    );
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(emptyForm);
    setAllImages([]);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const remaining = MAX_IMAGES - allImages.length;
    if (remaining <= 0) {
      setError(`Tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm.`);
      e.target.value = "";
      return;
    }

    const accepted = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(`Chỉ thêm được ${remaining} ảnh nữa. Đã bỏ qua ${files.length - remaining} ảnh vượt quá giới hạn.`);
    }

    const newImages = accepted.map((file) => ({
      type: "new",
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: false,
    }));

    setAllImages((prev) => {
      const updated = [...prev, ...newImages];
      const hasPrimary = updated.some((img) => img.isPrimary);
      if (!hasPrimary && updated.length > 0) {
        updated[0] = { ...updated[0], isPrimary: true };
      }
      return updated;
    });

    e.target.value = "";
  };

  const setPrimary = (index) => {
    setAllImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImage = async (index) => {
    const img = allImages[index];
    if (img.type === "existing" && editTarget) {
      try {
        await productService.deleteImage(editTarget.id, img.id);
      } catch (err) {
        setError("Không thể xóa ảnh: " + err.message);
        return;
      }
    }
    setAllImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const hasPrimary = updated.some((img) => img.isPrimary);
      if (!hasPrimary && updated.length > 0) {
        updated[0] = { ...updated[0], isPrimary: true };
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        productName: form.productName.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryIds: form.categoryIds,
        discountId: form.discountId ? Number(form.discountId) : null,
      };

      let savedProduct;
      if (editTarget) {
        savedProduct = await productService.update(editTarget.id, payload);
      } else {
        savedProduct = await productService.create(payload);
      }

      const newImages = allImages.filter((img) => img.type === "new");
      for (const img of newImages) {
        await productService.uploadImage(savedProduct.id, img.file, img.isPrimary);
      }

      if (editTarget) {
        const existingImages = allImages.filter((img) => img.type === "existing");
        for (const img of existingImages) {
          const original = editTarget.productImageList?.find((o) => o.id === img.id);
          if (original && original.isPrimary !== img.isPrimary) {
            await productService.updateImage(savedProduct.id, img.id, {
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary,
            });
          }
        }
      }

      await fetchProducts();
      closeModal();
    } catch (err) {
      if (err.message?.includes("413") || err.message?.includes("Maximum upload size")) {
        setError("File ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 10MB");
      } else {
        setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      await fetchProducts();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Loi xoa san pham:", err);
    }
  };

  const getPrimaryImage = (product) => {
    if (!product.productImageList || product.productImageList.length === 0) return null;
    return product.productImageList.find((img) => img.isPrimary === true) || product.productImageList[0];
  };

  return (
    <div>
      <div className="focus:outline-none caret-transparent flex items-center justify-between mb-8">
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

      <div className="focus:outline-none caret-transparent bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">Đang tải...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">Không tìm thấy sản phẩm nào</td>
              </tr>
            ) : (
              filtered.map((product, index) => {
                const primaryImage = getPrimaryImage(product);
                return (
                  <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      {primaryImage ? (
                        <img
                          src={primaryImage.imageUrl}
                          alt={product.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-300 text-xs">N/A</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{product.productName}</td>
                    <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-gray-900">{product.stockQuantity}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.categoryList?.map((c) => c.categoryName).join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(product)} className="text-sm text-blue-500 hover:text-blue-700 transition-colors">Sửa</button>
                        <button onClick={() => setDeleteTarget(product)} className="text-sm text-red-400 hover:text-red-600 transition-colors">Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-medium text-gray-900 mb-5">
              {editTarget ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <input
                  type="text"
                  name="productName"
                  placeholder="Nhập tên sản phẩm"
                  value={form.productName}
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
                  placeholder="Nhập mô tả sản phẩm"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Nhập giá"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Tồn kho</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Số lượng"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Danh mục <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.categoryIds.includes(c.id)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {c.categoryName}
                    </button>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-xs text-gray-400">Chưa có danh mục nào</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Discount <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <select
                  name="discountId"
                  value={form.discountId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Không áp dụng</option>
                  {discounts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.discountName}{" "}
                      {d.discountPercent
                        ? `(-${d.discountPercent}%)`
                        : `(-${formatCurrency(d.discountAmount)})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Ảnh sản phẩm{" "}
                  <span className="text-gray-400 font-normal">
                    (tùy chọn, tối đa {MAX_IMAGES} ảnh — hiện có {allImages.length}/{MAX_IMAGES})
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={allImages.length >= MAX_IMAGES}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {allImages.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {allImages.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                        <img
                          src={img.type === "existing" ? img.imageUrl : img.previewUrl}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg"
                        />

                        {img.isPrimary ? (
                          <span className="text-xs text-green-600 font-medium">Chính</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimary(index)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Đặt chính
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  {editTarget ? "Lưu" : "Thêm"}
                </button>
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
              Bạn có chắc muốn xóa sản phẩm{" "}
              <span className="font-medium text-gray-900">{deleteTarget.productName}</span> không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
