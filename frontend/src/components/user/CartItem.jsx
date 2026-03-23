import formatCurrency from "../../utils/formatCurrency";

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
      {/* Hinh san pham */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-xs">No image</span>
        )}
      </div>

      {/* Thong tin */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-medium text-gray-900 truncate mb-1">
          {item.name}
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-medium text-gray-900">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* So luong + xoa */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
            <button
              onClick={() => onUpdateQty(item.id, -1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-base"
            >
              -
            </button>
            <div className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-300">
              {item.qty}
            </div>
            <button
              onClick={() => onUpdateQty(item.id, 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-base"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Thanh tien */}
      <div className="text-base font-medium text-gray-900 flex-shrink-0">
        {formatCurrency(item.price * item.qty)}
      </div>
    </div>
  );
};

export default CartItem;
