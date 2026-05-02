const placeholderImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"%3E%3Crect width="640" height="420" fill="%23f1f5f9"/%3E%3Crect x="232" y="130" width="176" height="128" rx="16" fill="%23dbeafe"/%3E%3Cpath d="M252 238l46-48 36 36 24-26 62 66H252z" fill="%2394a3b8"/%3E%3Ccircle cx="366" cy="166" r="18" fill="%23f8fafc"/%3E%3Ctext x="320" y="304" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23475569"%3EProduct image not provided%3C/text%3E%3C/svg%3E'

export const getProductImage = () => placeholderImage

export const getProductDisplayImage = (product) => product?.imageUrl || placeholderImage

export default {
  default: placeholderImage,
}
