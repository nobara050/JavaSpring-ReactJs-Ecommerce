import { useState, useEffect } from "react";

export default function Slider() {
  const images = [
    "/assets/images/slider1.jpg",
    "/assets/images/slider2.png",
    "/assets/images/slider3.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  // =============================================================
  // Xử lý kéo thả
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translate, setTranslate] = useState(0);

  // Bắt đầu kéo
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  // Khi đang kéo
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setTranslate(delta);
  };

  // Khi thả chuột
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Nếu kéo sang phải (delta > 50px)
    if (translate > 50) {
      setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
    }
    // Nếu kéo sang trái (delta < -50px)
    else if (translate < -50) {
      setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
    }

    // Reset translate
    setTranslate(0);
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
      className="relative overflow-hidden w-full max-h-[260px] rounded-xl select-none m-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseUp();
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="w-full flex transition-transform duration-700 ease shadow-xl"
        style={{
          transform: `translateX(calc(-${current * 100}% + ${translate}px))`,
          transition: isDragging ? "none" : "transform 0.7s ease",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-full h-full object-fill flex-shrink-0"
            draggable={false}
          />
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
