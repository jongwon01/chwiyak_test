// 위시리스트 페이지 스크립트

// 뒤로가기
window.goBack = function() {
  window.history.back();
};

// 홈으로
window.goHome = function() {
  window.location.href = '../../pages/main.html';
};

// SHOP 바로가기
window.goShopping = function() {
  window.location.href = '../../pages/login&signup/main.html';
};

// 상품 상세 페이지로 이동
window.goToProduct = function(productId) {
  console.log(`상품 ${productId} 페이지로 이동`);
  // window.location.href = `../../pages/product/detail.html?id=${productId}`;
  alert(`상품 ${productId} 상세 페이지로 이동합니다.`);
};

// 위시리스트 토글 (하트 클릭)
window.toggleWishlist = function(productId) {
  if (confirm('위시리스트에서 삭제하시겠습니까?')) {
    const item = document.querySelector(`.wishlist-item[data-id="${productId}"]`);
    
    if (item) {
      // 페이드아웃 애니메이션
      item.style.transition = 'opacity 0.3s, transform 0.3s';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        item.remove();
        updateWishlistCount();
        
        // 모든 아이템이 삭제되었는지 확인
        checkIfEmpty();
      }, 300);
    }
    
    // 실제로는 서버에 요청을 보내야 함
    console.log(`상품 ${productId} 위시리스트에서 제거`);
  }
};

// 위시리스트 개수 업데이트
function updateWishlistCount() {
  const grid = document.getElementById('wishlist-grid');
  const items = grid.querySelectorAll('.wishlist-item');
  const count = items.length;
  
  // 개수 업데이트
  const countElement = document.querySelector('section p span');
  if (countElement) {
    countElement.textContent = count;
  }
}

// 빈 상태 확인
function checkIfEmpty() {
  const grid = document.getElementById('wishlist-grid');
  const items = grid.querySelectorAll('.wishlist-item');
  
  if (items.length === 0) {
    grid.classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  
  // 정렬 드롭다운 이벤트
  const sortSelect = document.querySelector('select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      console.log(`정렬 변경: ${sortValue}`);
      
      // 실제로는 서버에 요청하거나 클라이언트에서 정렬
      alert(`${this.options[this.selectedIndex].text}로 정렬합니다.`);
    });
  }
  
  // 초기 개수 설정
  updateWishlistCount();
  
});