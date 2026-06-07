export const fallbackImage =
  "https://images.unsplash.com/photo-1605100804763-247f6612d540?auto=format&fit=crop&w=900&q=85";

export const getProductId = (product) => product?._id || product?.id;

export const optimizeImageKitUrl = (url, params = "w-800,q-70,fo-auto,f-webp") => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("ik.imagekit.io")) return url;
  if (url.includes("/tr:") || url.includes("tr=")) return url; // Already transformed

  const regex = /^(https?:\/\/ik\.imagekit\.io\/[^\/]+)\/(.*)$/;
  return url.replace(regex, `$1/tr:${params}/$2`);
};

export const getProductImages = (product) => {
  const apiImages = Array.isArray(product?.images) ? product.images : [];
  const images = [
    ...apiImages,
    product?.image,
  ].filter(Boolean);

  const uniqueImages = [...new Set(images)];
  const processedImages = uniqueImages.length ? uniqueImages.slice(0, 7) : [fallbackImage];
  
  return processedImages.map((url) => optimizeImageKitUrl(url, "w-800,q-70,fo-auto,f-webp"));
};

export const getProductImage = (product) => getProductImages(product)[0];

export const getResponsiveImageProps = (product, isPriority = false) => {
  const rawUrl = getProductImages(product)[0];
  const isImageKit = rawUrl.includes("ik.imagekit.io") && !rawUrl.includes("unsplash.com");
  
  // Base Desktop image (w-800)
  const src = isImageKit ? optimizeImageKitUrl(rawUrl, "w-800,q-70,fo-auto,f-webp") : rawUrl;
  
  // Mobile specific resolution (w-400)
  const srcSet = isImageKit 
    ? `${optimizeImageKitUrl(rawUrl, "w-400,q-70,fo-auto,f-webp")} 400w, ${src} 800w`
    : undefined;

  return {
    src,
    srcSet,
    sizes: "(max-width: 768px) 400px, 800px",
    loading: isPriority ? "eager" : "lazy",
    fetchPriority: isPriority ? "high" : "auto",
    decoding: "async",
  };
};

export const formatPrice = (price) => {
  const numericPrice = Number(price || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: numericPrice % 1 === 0 ? 0 : 2,
  }).format(numericPrice);
};

export const categoryMatches = (product, category) => {
  if (category === "All") return true;

  const categoryAliases = {
    "breathtaking solitaires": "rings",
    "elegant cascades": "necklaces",
    "luminous drops": "earrings",
    "graceful adornments": "bracelets",
  };
  const selected = categoryAliases[category.toLowerCase()] || category;

  return product?.category?.toLowerCase() === selected.toLowerCase();
};
