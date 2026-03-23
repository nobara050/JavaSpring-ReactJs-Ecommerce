import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import Banner from "../components/common/Banner.jsx";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-w-6xl bg-[#ececec] min-h-screen">
      <Banner />
      <Header />

      <main className="flex flex-col items-center flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
