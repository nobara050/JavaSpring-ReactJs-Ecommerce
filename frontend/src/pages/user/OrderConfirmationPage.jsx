import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import orderService from "../../services/orderService";

const statusLabel = {
  CHO_XAC_NHAN: "Chờ xác nhận",
  DA_XAC_NHAN: "Đã xác nhận",
  DANG_GIAO: "Đang giao",
  DA_GIAO: "Đã giao",
  DA_HUY: "Đã hủy",
};

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState("");

  const isVnpay = location.state?.vnpay || false;

  useEffect(() => {
    if (order) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await orderService.getById(orderId);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Không thể tải thông tin đơn hàng.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Đặt hàng thành công</h1>
        <p className="text-sm text-gray-500">
          Mã đơn hàng: <span className="font-medium text-gray-900">#{order?.id}</span>
        </p>
        {isVnpay && (
          <div className="mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 inline-block">
            Thanh toán VNPay đang được xử lý
          </div>
        )}
      </div>

      {/* Thong tin don hang */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 mb-4">
        <h2 className="text-base font-medium text-gray-900">Thông tin đơn hàng</h2>

        <hr className="border-gray-200" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Trạng thái</span>
            <span className="font-medium text-gray-900">
              {statusLabel[order?.status] || order?.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phương thức thanh toán</span>
            <span className="font-medium text-gray-900">{order?.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngày đặt</span>
            <span className="font-medium text-gray-900">
              {order?.orderDate
                ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Danh sach san pham */}
      {order?.orderItemList && order.orderItemList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 mb-4">
          <h2 className="text-base font-medium text-gray-900">Sản phẩm</h2>
          <hr className="border-gray-200" />
          <div className="flex flex-col gap-3">
            {order.orderItemList.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                  <p className="text-gray-500">x{item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900 flex-shrink-0">
                  {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between text-sm font-medium text-gray-900">
            <span>Tổng cộng</span>
            <span>{formatCurrency(order?.totalAmount)}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Tiếp tục mua sắm
        </button>
        <button
          onClick={() => navigate(`/orders`)}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Xem đơn hàng của tôi
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
