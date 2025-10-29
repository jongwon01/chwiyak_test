// ============================================
// 포인트 페이지 JS (백엔드 API 완전 연동)
// ============================================

function goBack() {
  window.history.back();
}

function closeModal() {
  document.getElementById('point-modal').style.display = 'none';
}

// ✅ 페이지 로드 시 포인트 데이터 불러오기
async function loadPoints() {
  const token = localStorage.getItem("token");

  try {
    // 1. 잔액 조회
    const balanceResponse = await fetch("http://localhost:5000/api/buyer-points/balance", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const balanceData = await balanceResponse.json();

    if (balanceResponse.ok) {
      // 잔액 표시
      const balanceEl = document.querySelector('.point-balance');
      if (balanceEl) {
        balanceEl.textContent = `${Number(balanceData.total_points || 0).toLocaleString()}P`;
      }
    }

    // 2. 내역 조회
    const historyResponse = await fetch("http://localhost:5000/api/buyer-points/history?page=1&size=20", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const historyData = await historyResponse.json();

    if (historyResponse.ok) {
      // 내역 렌더링
      renderPointHistory(historyData.data || []);
    }

  } catch (err) {
    console.error("포인트 조회 오류:", err);
  }
}

// ✅ 포인트 내역 HTML 생성 (이미지와 100% 동일하게!)
function renderPointHistory(history) {
  const container = document.getElementById('point-history');
  
  if (!history || history.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">포인트 내역이 없습니다.</p>';
    return;
  }

  container.innerHTML = history.map((item, index) => {
    // amount가 양수면 적립(+), 음수면 사용(-)
    const isPlus = item.amount > 0;
    const amountColor = isPlus ? '#3b82f6' : '#ef4444';
    const amountSign = isPlus ? '+' : '-';
    const amountText = `${amountSign}${Math.abs(item.amount).toLocaleString()}P`;
    
    // 날짜 포맷
    const date = formatDate(item.created_at);
    
    // 마지막 항목이 아니면 border 추가
    const borderStyle = index < history.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : '';

    return `
      <div style="${borderStyle} padding: 1.25rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="font-size: 1.5rem; font-weight: 700; color: ${amountColor};">${amountText}</div>
          <div style="font-size: 0.875rem; color: #9ca3af;">${date}</div>
        </div>
        <div style="font-size: 0.875rem; color: #6b7280;">${item.description || '포인트'}</div>
      </div>
    `;
  }).join('');
}

// ✅ 날짜 포맷팅
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

// ============================================
// 이벤트 리스너
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // 페이지 로드 시 포인트 조회
  loadPoints();

  // 모달 배경 클릭 시 닫기
  const modal = document.getElementById('point-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});

// window 전역 함수로 등록
window.goBack = goBack;
window.closeModal = closeModal;