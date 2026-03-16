import Slider from "../../components/common/Slider";
import Carousel from "../../components/common/Carousel";

const HomePage = () => {
  return (
    <section className="flex flex-col items-center max-w-6xl">
      <Slider />
      <Carousel
        title="Sản phẩm nổi bật"
        images={[
          "/assets/images/pc1.png",
          "/assets/images/pc1.png",
          "/assets/images/pc1.png",
          "/assets/images/pc1.png",
          "/assets/images/pc1.png",
          "/assets/images/laptop1.png",
          "/assets/images/laptop1.png",
          "/assets/images/laptop1.png",
          "/assets/images/laptop1.png",
          "/assets/images/laptop1.png",
        ]}
      />
      <h1>Trang chủ</h1>
    </section>
  );
};

export default HomePage;
