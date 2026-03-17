import { useState } from "react";
import CartItem from "../../components/user/CartItem";
import formatCurrency from "../../utils/formatCurrency";

const initialCart = [
  {
    id: 1,
    name: "Classic Leather Sneaker — White/Tan Limited Edition 2026 Special Collection",
    price: 890000,
    originalPrice: 1200000,
    qty: 1,
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 150000;
  const total = subtotal + shipping;

  return (
    <div className="min-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-3 gap-8 items-start">

        {/* Danh sach san pham */}
        <div className="col-span-2 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center text-gray-400 text-sm">
              Giỏ hàng trống
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Tom tat don hang */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-base font-medium text-gray-900">Tóm tắt đơn hàng</h2>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phí vận chuyển</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between text-sm font-medium text-gray-900">
            <span>Tổng cộng</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
            Thanh toán
          </button>

          <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;