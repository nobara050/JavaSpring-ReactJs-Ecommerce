import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import addressService from "../../services/addressService";

const SHIPPING = 150000;

const CheckoutPage = () => {
  const navigate = useNavigate();

  const accountId = localStorage.getItem("userAccountId");
  const isLoggedIn = !!localStorage.getItem("userAccessToken");

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "Việt Nam",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !accountId) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [cartData, addressData] = await Promise.all([
          cartService.getCartByAccountId(accountId),
          addressService.getByAccountId(accountId),
        ]);
        if (!cancelled) {
          setCart(cartData);
          setAddresses(addressData);
          // Tu dong chon dia chi mac dinh neu co
          const defaultAddr = addressData.find((a) => a.isDefault) || addressData[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        }
      } catch {
        if (!cancelled) setError("Không thể tải thông tin. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [accountId, isLoggedIn, navigate]);

  const handleNewAddressChange = (e) => {
    setNewAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!cart || !cart.cartItemList || cart.cartItemList.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }

    let addressId = selectedAddressId;

    // Neu nhap dia chi moi thi tao truoc
    if (showNewAddress) {
      if (!newAddress.street || !newAddress.city) {
        setError("Vui lòng nhập đầy đủ địa chỉ.");
        return;
      }
      try {
        const created = await addressService.create(accountId, newAddress);
        addressId = created.id;
      } catch {
        setError("Không thể lưu địa chỉ mới.");
        return;
      }
    }

    if (!addressId) {
      setError("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        accountId: Number(accountId),
        addressId,
        cartId: cart.id,
        paymentMethod,
        orderItems: cart.cartItemList.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await orderService.create(orderPayload);

      // VNPay: mock redirect
      if (paymentMethod === "VNPAY") {
        navigate(`/order-confirmation/${createdOrder.id}`, {
          state: { order: createdOrder, vnpay: true },
        });
        return;
      }

      navigate(`/order-confirmation/${createdOrder.id}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      setError(err.message || "Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  const items = cart?.cartItemList || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.priceAtAdd) * item.quantity,
    0
  );
  const total = subtotal + SHIPPING;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Thanh toán</h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-8 items-start">

        {/* Cot trai - dia chi + phuong thuc */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* Dia chi giao hang */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h2>

            {addresses.length > 0 && !showNewAddress && (
              <div className="flex flex-col gap-3 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5 accent-gray-900"
                    />
                    <div className="text-sm text-gray-700">
                      <p>{addr.street}</p>
                      <p className="text-gray-500">{addr.city}{addr.state ? `, ${addr.state}` : ""}, {addr.country}</p>
                      {addr.isDefault && (
                        <span className="text-xs text-green-600 font-medium">Mặc định</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!showNewAddress ? (
              <button
                onClick={() => setShowNewAddress(true)}
                className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                + Thêm địa chỉ mới
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="street"
                    placeholder="Số nhà, tên đường..."
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Thành phố</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Thành phố"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Tỉnh / Quận</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Tỉnh / Quận"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowNewAddress(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phuong thuc thanh toan */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-medium text-gray-900 mb-4">Phương thức thanh toán</h2>
            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                paymentMethod === "COD" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-gray-900"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                paymentMethod === "VNPAY" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={() => setPaymentMethod("VNPAY")}
                  className="accent-gray-900"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">VNPay</p>
                  <p className="text-xs text-gray-500">Thanh toán qua cổng VNPay</p>
                </div>
              </label>
            </div>
          </div>

          {/* Danh sach san pham */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-medium text-gray-900 mb-4">Sản phẩm ({items.length})</h2>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    {item.primaryImageUrl ? (
                      <img src={item.primaryImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs">N/A</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                    {formatCurrency(Number(item.priceAtAdd) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cot phai - tom tat */}
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

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
