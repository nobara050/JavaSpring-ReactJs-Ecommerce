import { useEffect, useState } from "react";
import Slider from "../../components/common/Slider";
import Carousel from "../../components/common/Carousel";
import productService from "../../services/productService";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getAll();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Không tải được danh sách sản phẩm. Kiểm tra backend đã chạy chưa.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex flex-col items-center max-w-6xl w-full">
      <Slider />
      {loading && <p className="text-sm text-gray-500 py-4">Đang tải sản phẩm...</p>}
      {error && <p className="text-sm text-red-500 py-2">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500 py-4">Chưa có sản phẩm nào.</p>
      )}
      {products.length > 0 && (
        <Carousel title="Sản phẩm nổi bật" products={products} />
      )}
      <h1 className="sr-only">Trang chủ</h1>
    </section>
  );
};

export default HomePage;
