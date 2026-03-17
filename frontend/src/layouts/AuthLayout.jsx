import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
      style={{ background: "linear-gradient(to right, #2a83e9, #2a83e9)" }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;