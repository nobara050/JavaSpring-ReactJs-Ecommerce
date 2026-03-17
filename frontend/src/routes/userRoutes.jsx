import UserLayout from "../layouts/UserLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import HomePage from "../pages/user/HomePage.jsx";
import CartPage from "../pages/user/CartPage.jsx";
import ProductDetailPage from "../pages/user/ProductDetailPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";

const userRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "detail", element: <ProductDetailPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
    ],
  },
];

export default userRoutes;