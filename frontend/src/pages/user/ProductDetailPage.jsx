import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import resolveAssetUrl from "../../utils/resolveAssetUrl";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import reviewService from "../../services/reviewService";

// Modal thông báo thêm vào giỏ thành công
const AddToCartModal = ({ show, productName, onClose, onGoToCart }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-900 text-center">
          Đã thêm <span className="font-semibold">{productName}</span> vào giỏ hàng
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tiếp tục mua
          </button>
          <button
            onClick={onGoToCart}
            className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

// Hiển thị sao rating
const StarRating = ({ value, onChange, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`text-xl ${readOnly ? "cursor-default" : "cursor-pointer"} ${
            star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  // Gallery
  const [selectedImage, setSelectedImage] = useState(null);

  // Cart modal
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const isLoggedIn = !!localStorage.getItem("userAccessToken");
  const accountId = localStorage.getItem("userAccountId");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await productService.getById(id);
        if (!cancelled) {
          setProduct(data);
          // Set ảnh primary làm ảnh được chọn mặc định
          const primary =
            data.productImageList?.find((i) => i.isPrimary) ||
            data.productImageList?.[0] ||
            null;
          setSelectedImage(primary);
        }
      } catch {
        if (!cancelled) setError("Không tìm thấy sản phẩm hoặc lỗi tải dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    reviewService.getByProductId(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

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

  // Lấy hoặc tạo cartId cho user hiện tại
  const getOrCreateCartId = async () => {
    if (!accountId) return null;
    try {
      const cart = await cartService.getCartByAccountId(accountId);
      return cart.id;
    } catch {
      // Chưa có giỏ, tạo mới
      const cart = await cartService.createCart(accountId);
      return cart.id;
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      setCartLoading(true);
      const cartId = await getOrCreateCartId();
      if (!cartId) throw new Error("Không lấy được giỏ hàng");
      await cartService.addItem(cartId, Number(id), qty);
      setShowCartModal(true);
    } catch {
      alert("Thêm vào giỏ thất bại, vui lòng thử lại.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      setCartLoading(true);
      const cartId = await getOrCreateCartId();
      if (!cartId) throw new Error("Không lấy được giỏ hàng");
      await cartService.addItem(cartId, Number(id), qty);
      navigate("/cart");
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    try {
      setReviewLoading(true);
      setReviewError("");
      const newReview = await reviewService.create(Number(id), Number(accountId), reviewRating, reviewComment.trim());
      setReviews((prev) => [newReview, ...prev]);
      setReviewComment("");
      setReviewRating(5);
    } catch {
      setReviewError("Gửi đánh giá thất bại, vui lòng thử lại.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto m-5 text-center text-gray-500 py-16">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto m-5 text-center py-16">
        <p className="text-red-500 mb-4">{error || "Không có dữ liệu."}</p>
        <Link to="/" className="text-blue-600 underline">Về trang chủ</Link>
      </div>
    );
  }

  const imageList = product.productImageList || [];

  return (
    <div className="max-w-5xl mx-auto m-5">
      <AddToCartModal
        show={showCartModal}
        productName={product.productName}
        onClose={() => setShowCartModal(false)}
        onGoToCart={() => { setShowCartModal(false); navigate("/cart"); }}
      />

      {/* Thong tin san pham */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl border border-gray-200 p-6 md:p-10 min-w-4xl focus:outline-none caret-transparent">

        {/* Gallery anh */}
        <div className="flex flex-col gap-3 p-2">
          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center overflow-hidden focus:outline-none caret-transparent">
            {selectedImage ? (
              <img
                src={resolveAssetUrl(selectedImage.imageUrl)}
                alt={product.productName}
                className="max-h-full max-w-full object-contain"
                draggable={false}
              />
            ) : (
              <span className="text-gray-400 text-sm">Chưa có ảnh</span>
            )}
          </div>

          {/* Thumbnail list */}
          {imageList.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {imageList.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors ${
                    selectedImage?.id === img.id ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={resolveAssetUrl(img.imageUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thong tin ben phai */}
        <div className="px-10 flex flex-col justify-center">
          {inStock ? (
            <div>
              <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full mb-3">
                Còn hàng
              </span>
            </div>
          ) : (
            <div>
              <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-3">
                Hết hàng
              </span>
            </div>
          )}

          <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.productName}</h1>

          {/* Category */}
          {product.categoryList?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.categoryList.map((cat) => (
                <span key={cat.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {cat.categoryName}
                </span>
              ))}
            </div>
          )}

          {discountLabel && (
            <p className="text-sm text-orange-600 font-medium mb-2">{discountLabel}</p>
          )}

          <div className="text-3xl font-medium text-gray-900 mb-1">{formatCurrency(price)}</div>

          <hr className="border-gray-200 my-4" />

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Số lượng</p>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
            <button
              type="button"
              disabled={!inStock || qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center disabled:opacity-50"
            >
              -
            </button>
            <div className="w-11 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300">
              {qty}
            </div>
            <button
              type="button"
              disabled={!inStock || qty >= stock}
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center disabled:opacity-50"
            >
              +
            </button>
          </div>
          {inStock && qty >= stock && (
            <p className="text-xs text-orange-500 mt-1 mb-4">Đã đạt số lượng tối đa trong kho ({stock})</p>
          )}
          {(!inStock || qty < stock) && <div className="mb-5" />}

          <div className="flex gap-3">
            <button
              type="button"
              disabled={!inStock || cartLoading}
              onClick={handleAddToCart}
              className="flex-1 py-3 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cartLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
            </button>
            <button
              type="button"
              disabled={!inStock || cartLoading}
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mo ta san pham */}
      <div className="mt-5 border border-gray-200 rounded-xl bg-white p-6 md:p-10 focus:outline-none caret-transparent">
        <h2 className="text-base font-medium text-gray-900 mb-3">Mô tả sản phẩm</h2>
        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
          {product.description || "Chưa có mô tả."}
        </p>
      </div>

      {/* Danh gia san pham */}
      <div className="mt-5 border border-gray-200 rounded-xl bg-white p-6 md:p-10">
        <h2 className="text-base font-medium text-gray-900 mb-5 focus:outline-none caret-transparent">Đánh giá sản phẩm</h2>

        {/* Form viet danh gia */}
        {isLoggedIn ? (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="focus:outline-none caret-transparent text-sm font-medium text-gray-700 mb-2 focus:outline-none caret-transparent">Viết đánh giá của bạn</p>
            <StarRating value={reviewRating} onChange={setReviewRating} />
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={3}
              className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {reviewError && <p className="text-xs text-red-500 mt-1">{reviewError}</p>}
            <button
              type="button"
              disabled={reviewLoading}
              onClick={handleSubmitReview}
              className="focus:outline-none caret-transparent mt-2 px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {reviewLoading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-gray-200 text-sm text-gray-500 focus:outline-none caret-transparent">
            <Link to="/login" className="text-gray-900 underline font-medium">Đăng nhập</Link> để viết đánh giá.
          </div>
        )}

        {/* Danh sach danh gia */}
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 focus:outline-none caret-transparent">Chưa có đánh giá nào.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {reviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} readOnly />
                  <span className="text-xs text-gray-400">
                    {review.createAt ? new Date(review.createAt).toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
