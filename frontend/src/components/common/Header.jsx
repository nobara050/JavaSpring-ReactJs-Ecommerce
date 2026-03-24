import { Link, useLocation } from "react-router-dom";

const Header = () => {
  useLocation();
  const isLoggedIn = !!localStorage.getItem("userAccessToken");
  const displayName = localStorage.getItem("userUsername") || localStorage.getItem("userEmail") || "Tài khoản";
  const avatar = localStorage.getItem("userAvatar") || null;

  return (
    <header className="flex justify-center items-center h-16 max-h-16 bg-[#2a83e9] text-white shadow-xs">
      <nav className="flex justify-between items-center gap-5 h-full w-[950px]">
        {/* Logo */}
        <div className="h-full flex justify-center items-center">
          <Link className="h-full" to="/">
            <img
              className="h-full"
              src="/assets/icons/logo_header.png"
              alt=""
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center w-1/4">
          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="w-full bg-white placeholder:text-slate-400 !text-slate-700 text-sm border border-slate-200 rounded-4xl pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Bạn tìm gì..."
              />
            </div>
          </div>
        </div>

        {/* Category Icon */}
        <div className="focus:outline-none caret-transparent flex justify-center items-center p-2 gap-1 hover:bg-[#f2f4f7] hover:rounded-t-xl hover:text-black">
          <div className="flex justify-center items-center">
            <div className="space-y-1">
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
            </div>
          </div>
          <span className="whitespace-nowrap">Danh mục</span>
        </div>

        {/* User */}
        <Link
          to={isLoggedIn ? "/profile" : "/login"}
          className="focus:outline-none caret-transparent flex justify-center items-center gap-2 hover:bg-[#2871d5] p-2 px-4 rounded-3xl min-w-[150px]"
        >
          {isLoggedIn && avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/30"
            />
          ) : (
            <img
              className="user-icon shrink-0"
              src="/assets/icons/user_header.svg"
              alt="user-icon"
            />
          )}
          <span className="whitespace-nowrap truncate">
            {isLoggedIn ? displayName : "Đăng nhập"}
          </span>
        </Link>

        {/* Cart Icon */}
        <Link
          to={"/cart"}
          className="focus:outline-none caret-transparent flex justify-center items-center gap-1 hover:bg-[#2871d5] p-2 px-4 rounded-3xl"
        >
          <img
            className="user-icon"
            src="/assets/icons/cart_header.svg"
            alt="cart-icon"
          />
          <span className="whitespace-nowrap">Giỏ hàng</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
