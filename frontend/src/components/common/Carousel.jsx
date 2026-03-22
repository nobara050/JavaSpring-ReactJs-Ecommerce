import { useState, useEffect, useCallback } from "react";
import Card from "./Card.jsx";

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string[]} [props.images] — URL ảnh tĩnh (legacy)
 * @param {object[]} [props.products] — từ API GET /product (ưu tiên hơn images)
 */
export default function Carousel({ title = "", images = [], products = null }) {
  const [current, setCurrent] = useState(0);
  const total = products?.length ? products.length : images.length;
  const visibleCount = 5;
  const maxIndex = Math.max(0, total - visibleCount);

  const next = useCallback(() => {
    setCurrent((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  const prev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  // =============================================================
  // Xử lý auto play
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, current, next]);

  useEffect(() => {
    setCurrent(0);
  }, [total]);

  // =============================================================
  // Div trả về
  return (
    <div
      className="relative overflow-hidden w-full max-h-[600px] rounded-xl select-none m-4 bg-white pt-4 pb-4 shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h1 className="pl-4 text-xl font-medium">{title}</h1>
      <div
        className="w-full h-full flex transition-transform duration-700 ease"
        style={{
          transform: `translateX(-${current * (100 / visibleCount)}%)`,
          transition: "transform 0.7s ease",
        }}
      >
        {products?.length
          ? products.map((p) => (
              <div className="w-1/5 flex-shrink-0 p-3" key={p.id}>
                <Card product={p} />
              </div>
            ))
          : images.map((src, i) => (
              <div className="w-1/5 flex-shrink-0 p-3" key={i}>
                <Card imageSrc={src} />
              </div>
            ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-[45%] text-3xl bg-gray-300 p-2 pt-0 rounded-full shadow-md"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-[45%] text-3xl bg-gray-300 p-2 pt-0 rounded-full shadow-md"
      >
        ›
      </button>
    </div>
  );
}
