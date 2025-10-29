// 리뷰 페이지 스크립트

// 뒤로가기
window.goBack = function() {
  window.location.href = './mypage.html';
};

// 상품 보러가기
window.goShopping = function() {
  window.location.href = './main.html';
};

// 리뷰 쓰기 페이지로 이동
window.goToWriteReview = function() {
  console.log('리뷰 쓰기 페이지로 이동');
  window.location.href = './review-write.html';
};

// 별점을 별 문자로 변환
function getStarRating(rating) {
  const fullStars = '★'.repeat(rating);
  const emptyStars = '☆'.repeat(5 - rating);
  return fullStars + emptyStars;
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 내 리뷰 불러오기
async function loadMyReviews() {
  const loading = document.getElementById('my-reviews-loading');
  const container = document.getElementById('my-reviews-container');
  const emptyMessage = document.getElementById('my-reviews-empty');
  
  try {
    // 토큰 가져오기
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      window.location.href = '/frontend/pages/login&signup/login.html';
      return;
    }
    
    // API 호출
    const response = await fetch('http://localhost:5000/api/reviews/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('리뷰를 불러오는데 실패했습니다.');
    }
    
    const reviews = await response.json();
    
    // 로딩 숨기기
    loading.classList.add('hidden');
    
    if (reviews.length === 0) {
      // 리뷰가 없을 때
      emptyMessage.classList.remove('hidden');
    } else {
      // 리뷰 렌더링
      container.innerHTML = reviews.map(review => `
        <div class="review-card" data-review-id="${review.review_id}">
          <div class="review-header">
            <div class="review-image" style="background-image: url('${review.product_image || ''}')"></div>
            <div class="flex-1">
              <div class="review-product">${review.brand || ''} ${review.product_name}</div>
              <div class="review-rating">${getStarRating(review.rating)}</div>
            </div>
          </div>
          <div class="review-content">
            ${review.content}
          </div>
          ${review.seller_comment ? `
          <div class="mt-3 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-1">판매자 답변</p>
            <p class="text-sm">${review.seller_comment}</p>
          </div>
          ` : ''}
          <div class="review-date">${formatDate(review.created_at)}</div>
          <div class="review-actions">
            <button class="review-btn edit-btn" data-review-id="${review.review_id}">수정</button>
            <button class="review-btn delete-btn" data-review-id="${review.review_id}">삭제</button>
          </div>
        </div>
      `).join('');
      
      // 수정/삭제 버튼 이벤트 추가
      attachReviewButtonEvents();
    }
  } catch (error) {
    console.error('리뷰 로딩 오류:', error);
    loading.innerHTML = '<p class="text-red-500">리뷰를 불러오는데 실패했습니다.</p>';
  }
}

// 리뷰 삭제
async function deleteReview(reviewId) {
  if (!confirm('리뷰를 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      alert('리뷰가 삭제되었습니다.');
      // 해당 리뷰 카드 제거
      const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
      if (reviewCard) {
        reviewCard.remove();
      }
      
      // 리뷰가 없으면 빈 메시지 표시
      const container = document.getElementById('my-reviews-container');
      if (container.children.length === 0) {
        document.getElementById('my-reviews-empty').classList.remove('hidden');
      }
    } else {
      const result = await response.json();
      alert(result.message || '리뷰 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 삭제 오류:', error);
    alert('리뷰 삭제 중 오류가 발생했습니다.');
  }
}

// 수정/삭제 버튼 이벤트 연결
function attachReviewButtonEvents() {
  const editBtns = document.querySelectorAll('.edit-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');
  
  editBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const reviewId = this.getAttribute('data-review-id');
      alert('리뷰 수정 기능은 준비 중입니다.');
      // window.location.href = `./review-edit.html?id=${reviewId}`;
    });
  });
  
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const reviewId = this.getAttribute('data-review-id');
      deleteReview(reviewId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  
  console.log('리뷰 페이지 로드됨');
  
  // 탭 전환 기능
  const tabs = document.querySelectorAll('.review-tab');
  const writtenTab = document.getElementById('written-tab');
  const myTab = document.getElementById('my-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // 모든 탭에서 active 제거
      tabs.forEach(t => t.classList.remove('active'));
      
      // 클릭한 탭에 active 추가
      this.classList.add('active');
      
      const tabType = this.getAttribute('data-tab');
      console.log(`탭 변경: ${tabType}`);
      
      // 탭 내용 전환
      if (tabType === 'written') {
        writtenTab.classList.remove('hidden');
        myTab.classList.add('hidden');
      } else if (tabType === 'my') {
        writtenTab.classList.add('hidden');
        myTab.classList.remove('hidden');
        // 내 리뷰 탭으로 전환 시 리뷰 로드
        loadMyReviews();
      }
    });
  });
  
  // 리뷰 쓰기 버튼 이벤트 (혹시 모를 경우 대비)
  const writeReviewBtns = document.querySelectorAll('#written-tab button');
  writeReviewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('리뷰 쓰기 버튼 클릭됨');
      window.location.href = './review-write.html';
    });
  });
  
});