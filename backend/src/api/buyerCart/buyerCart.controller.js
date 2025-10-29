// /backend/src/api/buyerCart/buyerCart.controller.js

import * as service from "./buyerCart.service.js";

// 장바구니 목록 조회
export const getCartItems = async (req, res) => {
    try {
        const items = await service.getCart(req.buyer_id);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 장바구니에 상품 추가 (또는 수량 업데이트)
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const result = await service.addOrUpdateCart(req.buyer_id, productId, quantity);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 장바구니 상품 수량 변경
export const updateItemQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        const result = await service.updateQuantity(req.buyer_id, cartItemId, quantity);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 장바구니 항목 삭제
export const removeItemFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const result = await service.removeItem(req.buyer_id, cartItemId);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};