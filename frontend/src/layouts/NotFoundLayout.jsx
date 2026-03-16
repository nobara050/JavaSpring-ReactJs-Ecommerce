import { Outlet } from "react-router-dom";

const NotFoundLayout = () => {
  return (
    <div className="min-w-[950px] max-w-full mx-auto bg-white">
      <main className="flex flex-col items-center">
        <Outlet /> {/* Đây là nơi các trang con sẽ hiển thị */}
      </main>
    </div>
  );
};

export default NotFoundLayout;
