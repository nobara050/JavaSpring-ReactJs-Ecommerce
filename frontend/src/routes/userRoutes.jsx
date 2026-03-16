import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout.jsx";
import NotFoundLayout from "../layouts/NotFoundLayout.jsx";
import HomePage from "../pages/user/HomePage.jsx";
import CartPage from "../pages/user/CartPage.jsx";
import NotFoundPage from "../pages/common/NotFoundPage.jsx";
import DetailPage from "../pages/user/DetailPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "homepage", element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "detail", element: <DetailPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
]);

export default router;
