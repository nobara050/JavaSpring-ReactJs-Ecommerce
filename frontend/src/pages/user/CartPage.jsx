import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/user/CartItem";
import formatCurrency from "../../utils/formatCurrency";
import cartService from "../../services/cartService";

const SHIPPING = 150000;

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accountId = localStorage.getItem("userAccountId");
  const isLoggedIn = !!localStorage.getItem("userAccessToken");

  useEffect(() => {
    if (!isLoggedIn || !accountId) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await cartService.getCartByAccountId(accountId);
        if (!cancelled) setCart(data);
      } catch {
        if (!cancelled) setError("Không thể tải giỏ hàng.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [accountId, isLoggedIn, navigate]);

  const handleUpdateQty = async (cartItemId, delta) => {
    const item = cart.cartItemList.find((i) => i.id === cartItemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    try {
      await cartService.updateItemQuantity(cart.id, cartItemId, newQty);
      setCart((prev) => ({
        ...prev,
        cartItemList: prev.cartItemList.map((i) =>
          i.id === cartItemId ? { ...i, quantity: newQty } : i
        ),
      }));
    } catch {
      alert("Cập nhật số lượng thất bại.");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await cartService.removeItem(cart.id, cartItemId);
      setCart((prev) => ({
        ...prev,
        cartItemList: prev.cartItemList.filter((i) => i.id !== cartItemId),
      }));
    } catch {
      alert("Xóa sản phẩm thất bại.");
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">Đang tải giỏ hàng...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  const items = cart?.cartItemList || [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.priceAtAdd) * item.quantity, 0);
  const total = subtotal + SHIPPING;

  return (
    <div className="min-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-3 gap-8 items-start">

        {/* Danh sach san pham */}
        <div className="col-span-2 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center text-gray-400 text-sm">
              Giỏ hàng trống
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  name: item.productName,
                  price: Number(item.priceAtAdd),
                  qty: item.quantity,
                  imageUrl: item.primaryImageUrl || null,
                }}
                onUpdateQty={(id, delta) => handleUpdateQty(id, delta)}
                onRemove={(id) => handleRemove(id)}
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
              <span>{formatCurrency(SHIPPING)}</span>
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

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
