import BASE_URL from "./constants";

/**
 * Backend trả về imageUrl dạng /uploads/... — ghép với origin API.
 */
export default function resolveAssetUrl(url) {
  if (!url) return "/assets/images/pc1.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
}
