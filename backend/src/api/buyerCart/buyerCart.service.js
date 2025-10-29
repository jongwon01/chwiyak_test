// /backend/src/api/buyerCart/buyerCart.service.js

import * as model from "./buyerCart.model.js";

// 장바구니 목록 조회
export const getCart = async (buyerId) => {
    return await model.getCartItemsByBuyerId(buyerId);
};

// 장바구니에 상품 추가 또는 수량 업데이트
export const addOrUpdateCart = async (buyerId, productId, quantity = 1) => {
  if (!productId || !quantity) throw new Error("상품 ID와 수량은 필수입니다.");

  const existingItem = await model.findCartItem(buyerId, productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    await model.updateCartItemQuantity(existingItem.cart_item_id, newQuantity);
  } else {
    await model.createCartItem(buyerId, productId, quantity);
  }
  return { message: "장바구니에 상품이 추가되었습니다." };
};

// 장바구니 상품 수량 변경
export const updateQuantity = async (buyerId, cartItemId, quantity) => {
    if (quantity < 1) throw new Error("수량은 1 이상이어야 합니다.");
    // 본인 장바구니 항목인지 확인하는 로직 추가 가능 (보안 강화)
    await model.updateCartItemQuantity(cartItemId, quantity);
    return { message: "수량이 변경되었습니다." };
};

// 장바구니 항목 삭제
export const removeItem = async (buyerId, cartItemId) => {
    const success = await model.deleteCartItem(buyerId, cartItemId);
    if (!success) throw new Error("상품을 삭제하지 못했습니다.");
    return { message: "상품이 장바구니에서 삭제되었습니다." };
};