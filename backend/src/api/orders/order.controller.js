import db from "../../config/db.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPING",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "잘못된 상태값입니다." });

    const [result] = await db.query(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?`,
      [status, orderId]
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });

    res.status(200).json({ message: "주문 상태 변경 완료", status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
