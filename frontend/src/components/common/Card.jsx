const Card = ({ imageSrc }) => {
  return (
    <div className="p-0 m-0 w-full h-full border rounded-md shadow-md">
      <img
        src={imageSrc}
        alt="product-image"
        className="!h-[210px] w-full object-fill p-2"
        draggable={false}
      />
      <div className="px-2 pb-4">
        <h3 className="text-sm px-2 twoline-truncate">
          Laptop HP 240 G10 - B93GZAT (i5 1334U, 16GB, 512GB, Full HD, Win11)
        </h3>
      </div>
    </div>
  );
};
export default Card;
