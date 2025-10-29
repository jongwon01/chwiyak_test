// 판매자 페이지 스크립트

const API_BASE = "http://localhost:5000";
function getToken() {
  return localStorage.getItem("token") || "";
}

window.goBack = function() {
  window.location.href = './main.html';
};

window.goToProductRegister = function() {
  window.location.href = './seller-product-register.html';
};

window.goToProductList = function() {
  window.location.href = './seller-product-list.html?user_id=10000';
};

window.goToOrderList = function() {
  window.location.href = './seller-order-list.html';
};

window.goToReviewList = function() {
  window.location.href = './review.html';
};

// 정산 계좌 관리 페이지로 이동
window.goToSettlement = function() {
  window.location.href = './seller-settle.html';
};

// 판매자 프로필 관리 페이지로 이동
window.goToSellerProfile = function() {
  window.location.href = './seller-profile.html';
};

// 판매자 프로필 정보 불러오기
async function loadSellerProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (!res.ok) {
      throw new Error('프로필 조회 실패');
    }
    
    const user = await res.json();
    
    // 판매자명 표시
    const sellerNameElement = document.querySelector('h2.text-2xl.font-bold');
    if (sellerNameElement) {
      sellerNameElement.textContent = user.name || '판매자명';
    }
    
    // 이메일 표시
    const emailElement = document.querySelector('p.text-sm.text-gray-600');
    if (emailElement) {
      emailElement.textContent = user.email || 'seller****@email.com';
    }
    
  } catch (err) {
    console.error('프로필 로드 실패:', err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 로그인 확인
  if (!getToken()) {
    alert('로그인이 필요합니다.');
    window.location.href = '../../pages/login&signup/login.html';
    return;
  }
  
  // 판매자 정보 불러오기
  loadSellerProfile();
  
  // 통계 정보 불러오기
  loadSellerStats();
  
  // 최근 주문 불러오기
  loadRecentOrders();
});

function loadSellerStats() {
  // API 호출: GET /api/seller/stats
  // 임시 데이터
  console.log('판매자 통계 로드');
}

function loadRecentOrders() {
  // API 호출: GET /api/seller/orders?limit=3
  // 임시 데이터
  console.log('최근 주문 로드');
}