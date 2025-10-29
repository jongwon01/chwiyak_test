import * as model from "./buyerWishlist.model.js";

export const getBuyerWishlist = async (buyerId) => {
  return await model.getWishlist(buyerId);
};

export const addToWishlist = async (buyerId, productId) => {
  if (!productId) throw new Error("상품 ID가 필요합니다.");
  await model.addWishlist(buyerId, productId);
  return true;
};

export const removeFromWishlist = async (buyerId, productId) => {
  const success = await model.removeWishlist(buyerId, productId);
  if (!success) throw new Error("찜 목록에서 제거 실패");
  return true;
};
