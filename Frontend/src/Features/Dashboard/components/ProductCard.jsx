import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import {
  fallbackImage,
  formatPrice,
  getProductId,
  getResponsiveImageProps,
} from "../../../utils/products";

const HeartIcon = ({ filled }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const ProductCard = ({ product, priority = false }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const productId = getProductId(product);
  const saved = isFavorite(productId);

  const activeNavigationId = product.slug || productId;

  const goToProduct = useCallback(() => {
    navigate(`/product/${activeNavigationId}`);
  }, [navigate, activeNavigationId]);

  const handleFavorite = useCallback(
    (event) => {
      event.stopPropagation();
      toggleFavorite(productId);
    },
    [productId, toggleFavorite],
  );

  return (
    <article className="product-card h-full flex flex-col justify-between">
      <div
        className="product-card__media aspect-[4/5]"
        onClick={goToProduct}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") goToProduct();
        }}
      >
        <img
          {...getResponsiveImageProps(product, priority)}
          alt={`${product.category ? product.category + " " : ""}${product.name}`}
          className="product-card__image h-full w-full object-cover"
          width="400"
          height="500"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
            event.currentTarget.srcset = "";
          }}
        />
        <button
          type="button"
          onClick={handleFavorite}
          className={`product-card__favorite ${saved ? "is-active" : ""}`}
          title={saved ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <div className="product-card__body flex-grow flex flex-col">
        <p className="product-card__category">
          {product.category || "Fine Jewellery"}
        </p>
        <h3 className="product-card__title line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="product-card__description line-clamp-2 mt-1 flex-grow">
            {product.description}
          </p>
        )}
        <p className="product-card__price mt-auto">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
};

export default memo(ProductCard);
