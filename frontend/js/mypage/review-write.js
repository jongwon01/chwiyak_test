// 리뷰 쓰기 페이지 스크립트

// 뒤로가기
window.goBack = function() {
  window.history.back();
};

// 홈으로
window.goHome = function() {
  window.location.href = '../../pages/main.html';
};

document.addEventListener("DOMContentLoaded", () => {
  
  let selectedRating = 0;
  let uploadedPhotos = [];
  const maxPhotos = 5;

  // 별점 선택 기능
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingText = document.getElementById('rating-text');
  
  starButtons.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-rating'));
      updateStars(selectedRating);
      updateRatingText(selectedRating);
    });

    // 마우스 호버 효과
    btn.addEventListener('mouseenter', function() {
      const hoverRating = parseInt(this.getAttribute('data-rating'));
      updateStars(hoverRating);
    });
  });

  // 별점 영역에서 마우스가 나갈 때 선택된 별점으로 복원
  const starContainer = starButtons[0].parentElement;
  starContainer.addEventListener('mouseleave', function() {
    updateStars(selectedRating);
  });

  // 별 업데이트 함수
  function updateStars(rating) {
    starButtons.forEach((btn, index) => {
      if (index < rating) {
        btn.classList.remove('text-gray-300');
        btn.classList.add('text-yellow-400');
      } else {
        btn.classList.remove('text-yellow-400');
        btn.classList.add('text-gray-300');
      }
    });
  }

  // 별점 텍스트 업데이트
  function updateRatingText(rating) {
    const texts = {
      1: '별로예요',
      2: '그저 그래요',
      3: '보통이에요',
      4: '좋아요',
      5: '최고예요!'
    };
    ratingText.textContent = texts[rating] || '별점을 선택해주세요';
  }

  // 리뷰 내용 글자 수 카운트
  const reviewContent = document.getElementById('review-content');
  const charCount = document.getElementById('char-count');
  
  reviewContent.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;
    
    if (length > 500) {
      this.value = this.value.substring(0, 500);
      charCount.textContent = 500;
    }
  });

  // 사진 업로드 기능
  const photoUpload = document.getElementById('photo-upload');
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  
  photoUpload.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (uploadedPhotos.length >= maxPhotos) {
        alert(`최대 ${maxPhotos}장까지만 첨부할 수 있습니다.`);
        return;
      }
      
      if (file.type.startsWith('image/')) {
        uploadedPhotos.push(file);
        displayPhoto(file);
      }
    });
    
    // input 초기화
    this.value = '';
  });

  // 사진 미리보기 표시
  function displayPhoto(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const photoDiv = document.createElement('div');
      photoDiv.className = 'relative w-24 h-24 flex-shrink-0';
      photoDiv.innerHTML = `
        <img src="${e.target.result}" class="w-full h-full object-cover rounded-lg" alt="리뷰 사진">
        <button class="remove-photo absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full text-xs hover:bg-gray-700 transition">
          ✕
        </button>
      `;
      
      // 삭제 버튼 이벤트
      const removeBtn = photoDiv.querySelector('.remove-photo');
      removeBtn.addEventListener('click', function() {
        const index = Array.from(photoPreviewContainer.children).indexOf(photoDiv);
        uploadedPhotos.splice(index, 1);
        photoDiv.remove();
      });
      
      photoPreviewContainer.appendChild(photoDiv);
    };
    
    reader.readAsDataURL(file);
  }

  // 리뷰 등록 버튼
  const submitBtn = document.getElementById('submit-review');
  
  submitBtn.addEventListener('click', async function() {
    // 유효성 검사
    if (selectedRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    
    const content = reviewContent.value.trim();
    if (content.length < 10) {
      alert('리뷰는 최소 10자 이상 작성해주세요.');
      reviewContent.focus();
      return;
    }
    
    // URL에서 product_id 가져오기 (또는 다른 방법으로 얻기)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id') || 1; // 기본값 설정
    
    // 리뷰 데이터 준비
    const reviewData = {
      product_id: productId,
      rating: selectedRating,
      content: content,
      image_urls: [] // 이미지 업로드 구현 시 추가
    };
    
    try {
      // 버튼 비활성화
      submitBtn.disabled = true;
      submitBtn.textContent = '등록 중...';
      
      // 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/frontend/pages/login&signup/login.html';
        return;
      }
      
      // API 호출
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('리뷰가 등록되었습니다!');
        window.location.href = './orderlist.html?status=배송완료';
      } else {
        alert(result.message || '리뷰 등록에 실패했습니다.');
        submitBtn.disabled = false;
        submitBtn.textContent = '리뷰 등록';
      }
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      submitBtn.disabled = false;
      submitBtn.textContent = '리뷰 등록';
    }
  });
  
});