import db from "../../config/db.js";

export const getWishlist = async (buyerId) => {
  const [rows] = await db.query(
    `SELECT w.wishlist_id, w.product_id, p.name, p.brand, p.price, p.imageUrl, w.created_at 
     FROM wishlists w 
     JOIN products p ON w.product_id = p.product_id 
     WHERE w.buyer_id = ? ORDER BY w.created_at DESC`,
    [buyerId]
  );
  return rows;
};

export const addWishlist = async (buyerId, productId) => {
  await db.query(
    "INSERT IGNORE INTO wishlists (buyer_id, product_id, created_at) VALUES (?, ?, NOW())",
    [buyerId, productId]
  );
};

export const removeWishlist = async (buyerId, productId) => {
  const [result] = await db.query(
    "DELETE FROM wishlists WHERE buyer_id = ? AND product_id = ?",
    [buyerId, productId]
  );
  return result.affectedRows > 0;
};
