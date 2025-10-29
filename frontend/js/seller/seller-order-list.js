// 판매자 주문자 조회 페이지 스크립트

window.goBack = function() {
  window.location.href = './seller.html';
};

// 주문 상태 변경
window.updateOrderStatus = function(orderId, newStatus) {
  const statusText = {
    'processing': '처리중',
    'shipping': '배송중',
    'completed': '배송완료'
  };
  
  if (confirm(`주문 상태를 "${statusText[newStatus]}"로 변경하시겠습니까?`)) {
    // API 호출: PATCH /api/seller/order/${orderId}
    // body: { status: newStatus }
    
    console.log(`주문 ${orderId} 상태 변경: ${newStatus}`);
    
    // 실제 구현:
    // fetch(`/api/seller/order/${orderId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   alert('상태가 변경되었습니다.');
    //   location.reload();
    // });
    
    alert('상태가 변경되었습니다.');
    location.reload();
  }
};

// 주문 취소
window.cancelOrder = function(orderId) {
  if (confirm('이 주문을 취소하시겠습니까?')) {
    // API 호출: DELETE /api/seller/order/${orderId}
    
    console.log(`주문 ${orderId} 취소`);
    
    alert('주문이 취소되었습니다.');
    location.reload();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  
  // 필터 변경 이벤트
  const statusFilter = document.querySelector('select:first-of-type');
  const sortFilter = document.querySelector('select:last-of-type');
  
  if (statusFilter) {
    statusFilter.addEventListener('change', function() {
      const status = this.value;
      console.log('상태 필터:', status);
      loadOrders(status, sortFilter.value);
    });
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      const sort = this.value;
      console.log('정렬:', sort);
      loadOrders(statusFilter.value, sort);
    });
  }
  
  // 초기 주문 목록 로드
  loadOrders('all', 'recent');
});

function loadOrders(status, sort) {
  // API 호출: GET /api/seller/orders?status=${status}&sort=${sort}
  // seller_id는 세션에서 가져옴
  
  console.log(`주문 조회 - 상태: ${status}, 정렬: ${sort}`);
  
  // 실제 구현 시:
  // fetch(`/api/seller/orders?status=${status}&sort=${sort}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     renderOrders(data);
  //   });
}

function renderOrders(orders) {
  // 주문 목록 렌더링
  console.log('주문 목록 렌더링:', orders);
}