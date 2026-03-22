import { Link } from "react-router-dom";
import resolveAssetUrl from "../../utils/resolveAssetUrl";
import formatCurrency from "../../utils/formatCurrency";

const cardClass =
  "p-0 m-0 w-full h-full border rounded-md shadow-md hover:shadow-lg transition-shadow";

/**
 * @param {object} props
 * @param {string} [props.imageSrc] — dùng khi không truyền product
 * @param {object} [props.product] — ProductResponseDto từ API
 */
const Card = ({ imageSrc, product }) => {
  if (product) {
    const primary =
      product.productImageList?.find((i) => i.isPrimary) || product.productImageList?.[0];
    const src = resolveAssetUrl(primary?.imageUrl);
    const title = product.productName || "Sản phẩm";
    const price = product.price;

    return (
      <Link to={`/product/${product.id}`} className={`block ${cardClass}`}>
        <img
          src={src}
          alt={title}
          className="!h-[210px] w-full object-fill p-2"
          draggable={false}
        />
        <div className="px-2 pb-4">
          <h3 className="text-sm px-2 twoline-truncate text-gray-900">{title}</h3>
          {price != null && (
            <p className="text-sm font-medium text-gray-800 px-2 pt-1">{formatCurrency(Number(price))}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClass}>
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
