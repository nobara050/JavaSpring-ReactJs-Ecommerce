import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import resolveAssetUrl from "../../utils/resolveAssetUrl";
import productService from "../../services/productService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await productService.getById(id);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setError("Không tìm thấy sản phẩm hoặc lỗi tải dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const primaryImage = useMemo(() => {
    if (!product?.productImageList?.length) return null;
    return (
      product.productImageList.find((i) => i.isPrimary) || product.productImageList[0]
    );
  }, [product]);

  const imageSrc = resolveAssetUrl(primaryImage?.imageUrl);

  const price = product?.price != null ? Number(product.price) : 0;
  const stock = product?.stockQuantity ?? 0;
  const inStock = stock > 0 && product?.isActive !== false;

  const discountLabel = useMemo(() => {
    const d = product?.discount;
    if (!d?.isActive) return null;
    if (d.discountPercent != null) return `Giảm ${d.discountPercent}%`;
    if (d.discountAmount != null) return `Giảm ${formatCurrency(Number(d.discountAmount))}`;
    return null;
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto m-5 text-center text-gray-500 py-16">Đang tải...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto m-5 text-center py-16">
        <p className="text-red-500 mb-4">{error || "Không có dữ liệu."}</p>
        <Link to="/" className="text-blue-600 underline">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto m-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl border border-gray-200 p-6 md:p-10">
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center border border-gray-200 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.productName}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        </div>

        <div>
          {inStock && (
            <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full mb-3">
              Còn hàng
            </span>
          )}
          {!inStock && (
            <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-3">
              Hết hàng
            </span>
          )}

          <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.productName}</h1>

          {discountLabel && (
            <p className="text-sm text-orange-600 font-medium mb-2">{discountLabel}</p>
          )}

          <div className="text-3xl font-medium text-gray-900 mb-1">{formatCurrency(price)}</div>

          <hr className="border-gray-200 my-4" />

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Số lượng</p>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit mb-5 overflow-hidden">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="w-11 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300">
              {qty}
            </div>
            <button
              type="button"
              onClick={() => setQty((q) => (inStock ? Math.min(stock, q + 1) : q))}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={!inStock}
              className="flex-1 py-3 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              disabled={!inStock}
              className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 border border-gray-200 rounded-xl bg-white p-6 md:p-10">
        <h2 className="text-base font-medium text-gray-900 mb-3">Mô tả sản phẩm</h2>
        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
          {product.description || "Chưa có mô tả."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
