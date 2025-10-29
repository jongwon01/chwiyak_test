import * as service from "./buyerWishlist.service.js";

export const getWishlist = async (req, res) => {
  try {
    const data = await service.getBuyerWishlist(req.buyer.buyer_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await service.addToWishlist(req.buyer.buyer_id, productId);
    res.status(201).json({ message: "위시리스트 추가 완료" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await service.removeFromWishlist(req.buyer.buyer_id, productId);
    res.status(200).json({ message: "위시리스트 삭제 완료" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
     


