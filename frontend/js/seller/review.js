// 판매자 리뷰 관리 스크립트

// 뒤로가기
window.goBack = function() {
  window.history.back();
};

// 현재 선택된 필터
let currentFilter = 'all';
let currentSort = 'latest';

// 필터 버튼 이벤트
document.addEventListener('DOMContentLoaded', () => {
  // 필터 버튼
  const filterButtons = document.querySelectorAll('.review-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 기존 active 제거
      filterButtons.forEach(b => b.classList.remove('active'));
      // 현재 버튼 active
      btn.classList.add('active');
      
      currentFilter = btn.dataset.filter;
      filterReviews();
    });
  });

  // 정렬 셀렉트
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      sortReviews();
    });
  }

  // 리뷰 데이터 로드
  loadReviews();
});

// 리뷰 필터링
function filterReviews() {
  const reviewItems = document.querySelectorAll('.review-item');
  
  reviewItems.forEach(item => {
    const rating = parseInt(item.dataset.rating);
    let show = false;

    switch(currentFilter) {
      case 'all':
        show = true;
        break;
      case '5':
        show = rating === 5;
        break;
      case '4':
        show = rating === 4;
        break;
      case '3':
        show = rating === 3;
        break;
      case '2':
        show = rating === 2;
        break;
      case '1':
        show = rating === 1;
        break;
    }

    if (show) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  updateFilterCounts();
}

// 리뷰 정렬
function sortReviews() {
  const reviewList = document.getElementById('review-list');
  const reviews = Array.from(reviewList.querySelectorAll('.review-item'));

  reviews.sort((a, b) => {
    const ratingA = parseInt(a.dataset.rating);
    const ratingB = parseInt(b.dataset.rating);

    switch(currentSort) {
      case 'latest':
        // 최신순 (현재 순서 유지)
        return 0;
      case 'oldest':
        // 오래된순 (역순)
        return 0;
      case 'rating-high':
        // 평점 높은순
        return ratingB - ratingA;
      case 'rating-low':
        // 평점 낮은순
        return ratingA - ratingB;
      default:
        return 0;
    }
  });

  // DOM 재정렬
  reviews.forEach(review => reviewList.appendChild(review));
}

// 필터 카운트 업데이트
function updateFilterCounts() {
  const visibleReviews = document.querySelectorAll('.review-item[style="display: block;"], .review-item:not([style*="display"])');
  const totalReviewsEl = document.getElementById('total-reviews');
  
  if (totalReviewsEl) {
    totalReviewsEl.textContent = visibleReviews.length;
  }
}

// 답변 모달 열기
window.openReplyModal = function(reviewId) {
  const modal = document.getElementById('reply-modal');
  const replyText = document.getElementById('reply-text');
  
  if (modal && replyText) {
    modal.classList.add('active');
    replyText.value = '';
    modal.dataset.reviewId = reviewId;
  }
};

// 답변 모달 닫기
window.closeReplyModal = function() {
  const modal = document.getElementById('reply-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

// 답변 제출
window.submitReply = function() {
  const modal = document.getElementById('reply-modal');
  const replyText = document.getElementById('reply-text');
  
  if (!replyText || !replyText.value.trim()) {
    alert('답변 내용을 입력해주세요.');
    return;
  }

  const reviewId = modal.dataset.reviewId;
  const replyContent = replyText.value.trim();

  // TODO: 서버에 답변 저장
  // API 호출: POST /api/seller/reviews/${reviewId}/reply
  // {
  //   reply: replyContent
  // }
  
  console.log('답변 등록:', { reviewId, replyContent });

  // 임시: 답변 영역 업데이트 (실제로는 서버 응답 후 처리)
  alert('답변이 등록되었습니다.');
  closeReplyModal();
  
  // 페이지 새로고침 또는 동적 업데이트
  // location.reload();
};

// 답변 수정
window.editReply = function(reviewId) {
  const confirmed = confirm('답변을 수정하시겠습니까?');
  if (!confirmed) return;

  // TODO: 기존 답변 불러와서 모달에 표시
  openReplyModal(reviewId);
  
  // 임시 데이터
  const replyText = document.getElementById('reply-text');
  if (replyText) {
    // 서버에서 기존 답변 가져오기
    // const existingReply = await fetchReply(reviewId);
    // replyText.value = existingReply.content;
  }
};

// 리뷰 신고
window.reportReview = function(reviewId) {
  const reason = prompt('신고 사유를 입력해주세요:\n\n1. 욕설/비방\n2. 허위 사실\n3. 광고/스팸\n4. 기타');
  
  if (!reason) return;

  // TODO: 서버에 신고 접수
  // API 호출: POST /api/seller/reviews/${reviewId}/report
  // {
  //   reason: reason
  // }

  console.log('리뷰 신고:', { reviewId, reason });
  alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
};

// 리뷰 데이터 로드
function loadReviews() {
  // TODO: 서버에서 리뷰 데이터 가져오기
  // API 호출: GET /api/seller/reviews
  
  console.log('리뷰 데이터 로드');
  
  // 임시: 현재 HTML에 있는 리뷰 사용
  updateFilterCounts();
}

// 더보기
window.loadMoreReviews = function() {
  // TODO: 페이지네이션으로 추가 리뷰 로드
  // API 호출: GET /api/seller/reviews?page=2
  
  console.log('더 많은 리뷰 로드');
  alert('모든 리뷰를 불러왔습니다.');
};

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
  const modal = document.getElementById('reply-modal');
  if (e.target === modal) {
    closeReplyModal();
  }
});