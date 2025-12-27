export const formatPrice = (price) => {
  return price ? Number(price).toLocaleString() : 0;
};
