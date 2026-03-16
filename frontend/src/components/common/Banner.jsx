import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="banner flex flex-col justify-center items-center h-11 bg-[#00e9ff]">
      <img
        className="max-h-full"
        src="/assets/images/banner.png"
        alt="Banner"
      />
    </div>
  );
};

export default Banner;
