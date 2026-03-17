import { useState } from "react";
import formatCurrency from "../../utils/formatCurrency";

const product = {
  name: "Classic Leather Sneaker — White/Tan Limited Edition 2026 Special Collection",
  price: 890000,
  originalPrice: 1200000,
  rating: 4,
  reviewCount: 128,
  description:
    "Handcrafted from full-grain leather with a cushioned insole and durable rubber outsole. Timeless silhouette that pairs with casual and smart-casual outfits.",
  inStock: true,
  reviews: [
    {
      id: 1,
      name: "Anh Nguyen",
      initials: "AN",
      date: "March 10, 2026",
      rating: 5,
      comment:
        "Really comfortable and well-made. The leather quality is excellent for the price. Will buy again.",
    },
    {
      id: 2,
      name: "Minh Tran",
      initials: "MT",
      date: "February 28, 2026",
      rating: 4,
      comment:
        "Good fit and looks great. Shipping was fast. Took off one star because the box was slightly damaged on arrival.",
    },
  ],
};

const DetailPage = () => {
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-5xl mx-auto m-5">
      {/* Product Image and Details */}
      <div className="grid grid-cols-2 gap-10 bg-white rounded-xl border border-gray-200 p-10">

        {/* Hinh san pham */}
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center border border-gray-200">
          <span className="text-gray-300 text-6xl">[ img ]</span>
        </div>

        {/* Thong tin san pham */}
        <div>
          {product.inStock && (
            <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full mb-3">
              In Stock
            </span>
          )}

          {/* Name - toi da 1 dong, qua dai thi ba cham */}
          <h1 className="text-2xl font-medium text-gray-900 mb-2 truncate">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= product.rating ? "text-amber-400" : "text-gray-300"}
              >
                &#9733;
              </span>
            ))}
            <span className="text-sm text-gray-500">
              {product.rating}.0 &nbsp;·&nbsp; {product.reviewCount} reviews
            </span>
          </div>

          {/* Gia */}
          <div className="text-3xl font-medium text-gray-900 mb-1">
            {formatCurrency(product.price)}
          </div>
          <div className="text-sm text-gray-400 line-through mb-4">
            {formatCurrency(product.originalPrice)}
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* So luong */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Quantity
          </p>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit mb-5 overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="w-11 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300">
              {qty}
            </div>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Nut them vao gio va mua ngay */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Thêm vào giỏ
            </button>
            <button className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Description - duoi grid */}
      <div className="mt-5 border border-gray-200 rounded-xl bg-white rounded-xl border border-gray-200 p-10">
        <h2 className="text-base font-medium text-gray-900 mb-3">
          Mô tả sản phẩm
        </h2>
        {/* Full name hien thi lai o day */}
        <p className="text-sm font-medium text-gray-700 mb-3">{product.name}</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Reviews */}
      <div className="mt-5 bg-white rounded-xl border border-gray-200 p-10">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Customer reviews
        </h2>
        {product.reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-xl px-5 py-4 mb-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {review.initials}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {review.name}
                </div>
                <div className="text-xs text-gray-400">{review.date}</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${
                      star <= review.rating ? "text-amber-400" : "text-gray-300"
                    }`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailPage;