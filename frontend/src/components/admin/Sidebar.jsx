import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Sản phẩm", path: "/admin/products" },
  { label: "Danh mục", path: "/admin/categories" },
  { label: "Đơn hàng", path: "/admin/orders" },
  { label: "Người dùng", path: "/admin/users" },
  { label: "Khuyến mãi", path: "/admin/discounts" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-white font-medium text-base">Admin Panel</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
              location.pathname === item.path
                ? "bg-gray-700 text-white font-medium"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;