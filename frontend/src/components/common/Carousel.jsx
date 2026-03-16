import { useState, useEffect } from "react";
import Card from "./Card.jsx";

export default function Carousel({ title = "", images = [] }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const visibleCount = 5;
  const maxIndex = total - visibleCount;

  const next = () => {
    setCurrent((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

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
  }, [isPaused, current]);

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
        {images.map((src, i) => (
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
