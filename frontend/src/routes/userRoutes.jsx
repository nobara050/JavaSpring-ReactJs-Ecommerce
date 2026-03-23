import UserLayout from "../layouts/UserLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import HomePage from "../pages/user/HomePage.jsx";
import CartPage from "../pages/user/CartPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ProductDetailPage from "../pages/user/ProductDetailPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import CheckoutPage from "../pages/user/CheckoutPage.jsx";
import OrderConfirmationPage from "../pages/user/OrderConfirmationPage.jsx";

const userRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-confirmation/:orderId", element: <OrderConfirmationPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
];

export default userRoutes;