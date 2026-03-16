import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import Banner from "../components/common/Banner.jsx";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div class="min-w-6xl max-w-full bg-[#ececec]">
      <Banner />
      <Header />
      <main className="flex flex-col items-center">
        <Outlet /> {/* Đây là nơi các trang con sẽ hiển thị */}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
