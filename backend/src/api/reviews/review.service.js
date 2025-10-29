import * as model from "./review.model.js";

export const getProductReviews = async (productId) => {
  return await model.getReviewsByProduct(productId);
};

export const createNewReview = async (buyerId, productId, rating, content, imageUrls) => {
  if (!rating || !content) throw new Error("평점과 내용을 모두 입력해야 합니다.");
  const id = await model.createReview(productId, buyerId, rating, content, imageUrls);
  return await model.getReviewById(id);
};

export const updateExistingReview = async (reviewId, buyerId, rating, content, imageUrls) => {
  const success = await model.updateReview(reviewId, buyerId, rating, content, imageUrls);
  if (!success) throw new Error("리뷰 수정에 실패했습니다.");
  return await model.getReviewById(reviewId);
};

export const removeReview = async (reviewId, buyerId) => {
  const success = await model.deleteReview(reviewId, buyerId);
  if (!success) throw new Error("리뷰 삭제에 실패했습니다.");
  return true;
};

export const addSellerComment = async (reviewId, sellerId, comment) => {
  if (!comment) throw new Error("답변 내용을 입력해야 합니다.");
  const success = await model.updateSellerComment(reviewId, sellerId, comment);
  if (!success) throw new Error("판매자 답변 등록에 실패했습니다.");
  return true;
};