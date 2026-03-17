import { createBrowserRouter } from "react-router-dom";
import userRoutes from "./userRoutes.jsx";
import NotFoundLayout from "../layouts/NotFoundLayout.jsx";
import NotFoundPage from "../pages/common/NotFoundPage.jsx";

const router = createBrowserRouter([
  ...userRoutes,
  {
    path: "*",
    element: <NotFoundLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
]);

export default router;