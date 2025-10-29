// 주문 내역 페이지 스크립트

// 뒤로가기
window.goBack = function() {
  window.history.back();
};

// 홈으로
window.goHome = function() {
  window.location.href = '../../pages/login&signup/main.html';
};

// SHOP 바로가기
window.goShopping = function() {
  window.location.href = '../../pages/login&signup/main.html';
};

// 리뷰 쓰기
window.writeReview = function() {
  window.location.href = '../../pages/mypage/review-write.html';
};

document.addEventListener("DOMContentLoaded", () => {
  
  // URL 파라미터에서 상태 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const statusParam = urlParams.get('status');
  
  // 탭 전환 기능
  const tabs = document.querySelectorAll('.order-tab');
  
  // 초기 로드 시 URL 파라미터에 맞는 탭 활성화
  if (statusParam) {
    tabs.forEach(tab => {
      const tabStatus = tab.getAttribute('data-status');
      if (tabStatus === statusParam) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    // 해당 상태의 주문 내역 로드
    loadOrders(statusParam);
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // 모든 탭에서 active 제거
      tabs.forEach(t => t.classList.remove('active'));
      
      // 클릭한 탭에 active 추가
      this.classList.add('active');
      
      const status = this.getAttribute('data-status');
      console.log(`${status} 탭 선택됨`);
      
      // 여기서 해당 상태의 주문 내역을 불러오는 로직 추가
      loadOrders(status);
    });
  });
  
  // 주문 내역 불러오기 함수 (추후 API 연동)
  function loadOrders(status) {
    const orderList = document.getElementById('order-list');
    
    // 상품 준비중인 경우 예시 데이터 표시
    if (status === '상품 준비중') {
      orderList.innerHTML = `
        <!-- 주문 아이템 -->
        <div class="bg-white rounded-lg shadow mb-4">
          <div class="p-4 border-b border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600">2025.01.15</span>
              <span class="text-sm font-medium text-blue-600">상품 준비중</span>
            </div>
            <p class="text-xs text-gray-500">주문번호: 20250115-001234</p>
          </div>
          
          <div class="p-4">
            <div class="flex gap-4">
              <!-- 상품 이미지 -->
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              
              <!-- 상품 정보 -->
              <div class="flex-1">
                <p class="font-semibold mb-1">CHANEL 클래식 플랩백</p>
                <p class="text-sm text-gray-600 mb-2">블랙 / 미디엄</p>
                <p class="text-lg font-bold">₩8,500,000</p>
              </div>
            </div>
            
            <!-- 버튼 -->
            <div class="mt-4 flex gap-2">
              <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                주문 상세
              </button>
              <button class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm">
                배송 조회
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (status === '배송완료') {
      // 배송완료인 경우 리뷰쓰기 버튼이 있는 예시 데이터 표시
      orderList.innerHTML = `
        <!-- 주문 아이템 -->
        <div class="bg-white rounded-lg shadow mb-4">
          <div class="p-4 border-b border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600">2025.01.10</span>
              <span class="text-sm font-medium text-green-600">배송완료</span>
            </div>
            <p class="text-xs text-gray-500">주문번호: 20250110-005678</p>
          </div>
          
          <div class="p-4">
            <div class="flex gap-4">
              <!-- 상품 이미지 -->
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              
              <!-- 상품 정보 -->
              <div class="flex-1">
                <p class="font-semibold mb-1">LOUIS VUITTON 네버풀</p>
                <p class="text-sm text-gray-600 mb-2">모노그램 / MM</p>
                <p class="text-lg font-bold">₩2,100,000</p>
              </div>
            </div>
            
            <!-- 버튼 -->
            <div class="mt-4 flex gap-2">
              <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                주문 상세
              </button>
              <button onclick="writeReview()" class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm">
                리뷰 쓰기
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // 다른 상태는 빈 상태 표시
      orderList.innerHTML = `
        <div class="empty-state bg-white rounded-lg shadow p-8">
          <p class="text-gray-500 mb-6">${status} 내역이 없습니다.</p>
          <button onclick="goShopping()" class="px-6 py-2.5 border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition font-medium">
            SHOP 바로가기
          </button>
        </div>
      `;
    }
  }
  
  // 필터 드롭다운 이벤트
  const filterSelect = document.querySelector('select');
  if (filterSelect) {
    filterSelect.addEventListener('change', function() {
      const filterValue = this.value;
      console.log(`필터 변경: ${filterValue}`);
      // 필터링 로직 추가
    });
  }
});