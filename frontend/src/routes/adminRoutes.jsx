import AdminLayout from "../layouts/AdminLayout.jsx";
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import ManageOrdersPage from "../pages/admin/ManageOrdersPage.jsx";
import ManageProductsPage from "../pages/admin/ManageProductsPage.jsx";
import ManageUsersPage from "../pages/admin/ManageUsersPage.jsx";
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage.jsx";

const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "orders", element: <ManageOrdersPage /> },
      { path: "products", element: <ManageProductsPage /> },
      { path: "users", element: <ManageUsersPage /> },
      { path: "categories", element: <ManageCategoriesPage /> },
    ],
  },
];

export default adminRoutes;