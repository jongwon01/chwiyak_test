// 마이페이지 스크립트
document.addEventListener("DOMContentLoaded", async () => {
  
  // ✅ 토큰 확인
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = '../login&signup/login.html';
    return;
  }

  // ✅ API에서 사용자 정보 가져오기
  try {
    const response = await fetch('http://localhost:5000/api/users/mypage/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('인증 실패');
    }

    const data = await response.json();
    console.log('📦 마이페이지 통합 데이터:', data); // 🔍 디버깅
    
    // ✅ 사용자 정보 표시
    const nameElement = document.querySelector('section h3');
    const emailElement = document.querySelector('section p');
    const usernameElement = document.getElementById('mypage-username');
    if (nameElement) nameElement.textContent = data.user.name;
    if (emailElement) emailElement.textContent = data.user.email;
    if (usernameElement && data.user.username) {
      usernameElement.style.display = '';
      usernameElement.textContent = `아이디: ${data.user.username}`;
    }

    // ✅ 주문 통계 업데이트
    const orderGrid = document.getElementById('order-status-grid');
    if (orderGrid) {
      orderGrid.innerHTML = `
        <div class="order-status-tab text-center py-8 cursor-pointer hover:bg-gray-100 transition" data-status="결제완료">
          <p class="text-sm font-medium text-gray-700 mb-2">결제완료</p>
          <p class="text-2xl text-gray-900">${data.stats?.orderCounts?.결제완료 || 0}</p>
        </div>
        <div class="order-status-tab text-center py-8 cursor-pointer hover:bg-gray-100 transition" data-status="상품 준비중">
          <p class="text-sm font-medium text-gray-700 mb-2">상품 준비중</p>
          <p class="text-2xl text-gray-900">${data.stats?.orderCounts?.['상품 준비중'] || 0}</p>
        </div>
        <div class="order-status-tab text-center py-8 cursor-pointer hover:bg-gray-100 transition" data-status="배송중">
          <p class="text-sm font-medium text-gray-700 mb-2">배송중</p>
          <p class="text-2xl text-gray-900">${data.stats?.orderCounts?.배송중 || 0}</p>
        </div>
        <div class="order-status-tab text-center py-8 cursor-pointer hover:bg-gray-100 transition" data-status="배송완료">
          <p class="text-sm font-medium text-gray-700 mb-2">배송완료</p>
          <p class="text-2xl text-gray-900">${data.stats?.orderCounts?.배송완료 || 0}</p>
        </div>
      `;
    }

    // ✅ 포인트 별도 조회 (통합 API에 포인트가 없거나 0일 경우 대비)
    let totalPoints = 0;
    try {
      console.log('💰 포인트 별도 조회 시작...');
      const pointResponse = await fetch('http://localhost:5000/api/buyer-points/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (pointResponse.ok) {
        const pointData = await pointResponse.json();
        console.log('💰 포인트 API 응답:', pointData);
        totalPoints = pointData.total_points || 0;
      } else {
        console.warn('⚠️ 포인트 API 실패, summary 데이터 사용');
        totalPoints = data.stats?.points || 0;
      }
    } catch (err) {
      console.error('❌ 포인트 조회 실패:', err);
      // summary API의 포인트 사용
      totalPoints = data.stats?.points || 0;
    }

    console.log('💰 최종 포인트:', totalPoints); // 🔍 디버깅

    // ✅ 쿠폰/포인트/리뷰 통계 업데이트
    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-item text-center py-4 cursor-pointer transition hover:bg-gray-50" data-type="쿠폰">
          <p class="text-sm font-medium text-gray-700 mb-1">쿠폰</p>
          <p class="text-xl text-gray-900">${data.stats?.couponCount || 0}</p>
        </div>
        <div class="stat-item text-center py-4 cursor-pointer transition hover:bg-gray-50" data-type="포인트">
          <p class="text-sm font-medium text-gray-700 mb-1">포인트</p>
          <p class="text-xl text-gray-900">${totalPoints.toLocaleString()}</p>
        </div>
        <div class="stat-item text-center py-4 cursor-pointer transition hover:bg-gray-50" data-type="리뷰">
          <p class="text-sm font-medium text-gray-700 mb-1">리뷰</p>
          <p class="text-xl text-gray-900">${data.stats?.reviewCount || 0}</p>
        </div>
      `;
    }

    // ✅ 위시리스트 표시
    const wishlistContainer = document.getElementById("wishlist-container");
    if (wishlistContainer && data.wishlist && data.wishlist.length > 0) {
      wishlistContainer.innerHTML = data.wishlist.map(item => `
        <div class="min-w-[180px] bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition wishlist-card">
          <div class="w-full h-[180px] bg-gray-300 flex items-center justify-center text-gray-500">
            ${item.thumbnailUrl ? `<img src="${item.thumbnailUrl}" class="w-full h-full object-cover">` : '이미지'}
          </div>
          <div class="p-3 bg-white">
            <p class="text-sm font-medium truncate">${item.name}</p>
            <p class="text-sm font-bold mt-2">₩${item.price.toLocaleString()}</p>
          </div>
        </div>
      `).join('');
    } else if (wishlistContainer) {
      wishlistContainer.innerHTML = `
        <div class="w-full text-center py-8 text-gray-500">
          <p>위시리스트가 비어있습니다.</p>
        </div>
      `;
    }

    // 주문 내역 탭 클릭 이벤트 재등록
    const orderTabs = document.querySelectorAll('.order-status-tab');
    orderTabs.forEach(tab => {
      tab.addEventListener("click", function() {
        const status = this.getAttribute('data-status');
        window.location.href = `./orderlist.html?status=${encodeURIComponent(status)}`;
      });
    });

    // 쿠폰/포인트/리뷰 클릭 이벤트 재등록
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item) => {
      item.addEventListener("click", () => {
        const type = item.getAttribute('data-type');
        if (type === '쿠폰') window.location.href = './coupon.html';
        else if (type === '포인트') window.location.href = './point.html';
        else if (type === '리뷰') window.location.href = './review.html';
      });
    });

    // 위시리스트 카드 클릭 이벤트
    if (wishlistContainer) {
      wishlistContainer.addEventListener("click", (e) => {
        const card = e.target.closest('.wishlist-card');
        if (card) {
          const productName = card.querySelector('.text-sm.font-medium')?.textContent;
          alert(`${productName} 상세 페이지로 이동합니다.`);
        }
      });
    }

  } catch (error) {
    console.error('❌ API 에러:', error);
    alert('사용자 정보를 불러오는데 실패했습니다.');
    localStorage.removeItem('token');
    window.location.href = '../login&signup/login.html';
  }

  // 위시리스트 슬라이더 함수
  window.slideLeft = function() {
    const container = document.getElementById("wishlist-container");
    if (container) container.scrollBy({ left: -220, behavior: "smooth" });
  };

  window.slideRight = function() {
    const container = document.getElementById("wishlist-container");
    if (container) container.scrollBy({ left: 220, behavior: "smooth" });
  };

  // 회원정보 수정 버튼
  const profileManageBtn = document.getElementById("profile-manage-btn");
  if (profileManageBtn) {
    profileManageBtn.addEventListener("click", () => {
      window.location.href = './profile.html';
    });
  }
  
  // 회원 탈퇴 버튼
  const withdrawBtn = document.getElementById("withdraw-btn");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", () => {
      if (confirm("정말 회원 탈퇴하시겠습니까?")) {
        // TODO: 탈퇴 API 호출
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        alert("회원 탈퇴 처리되었습니다.");
        window.location.href = '../main.html';
      }
    });
  }

  // 위시리스트 전체보기
  window.goToWishlist = function() {
    window.location.href = './wishlist.html';
  };
});