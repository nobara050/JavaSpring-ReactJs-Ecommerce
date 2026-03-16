import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center m-4 h-screen">
      <img
        className="max-w-120 max-h-120"
        src="/assets/images/404.png"
        alt="404-images"
      />
      <div className="flex flex-col items-center justify-center">
        <h1
          style={{ fontFamily: "Times New Roman, Times, serif" }}
          className="text-4xl p-2"
        >
          Xin lỗi, chúng tôi
        </h1>
        <h1
          style={{ fontFamily: "Times New Roman, Times, serif" }}
          className="text-4xl p-2"
        >
          không tìm thấy trang
        </h1>
        <h1
          style={{ fontFamily: "Times New Roman, Times, serif" }}
          className="text-4xl p-2"
        >
          mà bạn cần!
        </h1>
        <Link
          to="/"
          className="bg-[#2f80ed] p-2 m-2 rounded-3xl text-white hover:bg-blue-700 font-medium"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
