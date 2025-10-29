import db from "../../config/db.js";

export const getOrdersByBuyer = async (buyerId) => {
  // 주문 목록 가져오기
  const [orders] = await db.query(
    `SELECT o.order_id, o.order_name, o.total_price, o.status, o.created_at
     FROM orders o
     WHERE o.buyer_id = ?
     ORDER BY o.created_at DESC`,
    [buyerId]
  );
  
  // 각 주문의 상품 정보 가져오기 및 날짜/상태 포맷팅
  for (let order of orders) {
    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.brand, p.imageUrl, p.category
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order.order_id]
    );
    order.items = items;
    
    // 상태를 한글로 변환
    const statusMap = {
      'PENDING': '주문접수',
      'PAID': '결제완료',
      'SHIPPED': '배송중',
      'DELIVERED': '배송완료',
      'CANCELLED': '주문취소'
    };
    order.status_kr = statusMap[order.status] || order.status;
    
    // 날짜를 YYYY.MM.DD 형식으로 변환
    if (order.created_at) {
      const date = new Date(order.created_at);
      order.created_at_formatted = date.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', '');
    }
  }
  
  return orders;
};

// 특정 상태의 주문 조회
export const getOrdersByBuyerAndStatus = async (buyerId, status) => {
  const [orders] = await db.query(
    `SELECT o.order_id, o.order_name, o.total_price, o.status, o.created_at
     FROM orders o
     WHERE o.buyer_id = ? AND o.status = ?
     ORDER BY o.created_at DESC`,
    [buyerId, status]
  );
  
  // 각 주문의 상품 정보 가져오기 및 날짜/상태 포맷팅
  for (let order of orders) {
    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.brand, p.imageUrl, p.category
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order.order_id]
    );
    order.items = items;
    
    // 상태를 한글로 변환
    const statusMap = {
      'PENDING': '주문접수',
      'PAID': '결제완료',
      'SHIPPED': '배송중',
      'DELIVERED': '배송완료',
      'CANCELLED': '주문취소'
    };
    order.status_kr = statusMap[order.status] || order.status;
    
    // 날짜를 YYYY.MM.DD 형식으로 변환
    if (order.created_at) {
      const date = new Date(order.created_at);
      order.created_at_formatted = date.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', '');
    }
  }
  
  return orders;
};
