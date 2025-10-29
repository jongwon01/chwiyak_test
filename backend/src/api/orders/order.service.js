import * as model from "./order.model.js";

export const createNewOrder = async (buyerId, addressId, orderName, totalPrice, items) => {
  if (!items || items.length === 0) throw new Error("주문 항목이 비어 있습니다.");

  const orderId = await model.createOrder(buyerId, addressId, orderName, totalPrice);
  for (const item of items) {
    await model.addOrderItem(orderId, item.product_id, item.quantity, item.unit_price);
  }
  return orderId;
};

export const getBuyerOrders = async (buyerId) => {
  return await model.getOrdersByBuyer(buyerId);
};

export const getBuyerOrderDetail = async (orderId, buyerId) => {
  const order = await model.getOrderDetail(orderId, buyerId);
  if (!order) throw new Error("주문을 찾을 수 없습니다.");
  return order;
};

export const changeOrderStatus = async (orderId, status) => {
  const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) throw new Error("유효하지 않은 상태 값입니다.");

  const updated = await model.updateOrderStatus(orderId, status);
  if (!updated) throw new Error("주문 상태 변경에 실패했습니다.");
  return true;
};
