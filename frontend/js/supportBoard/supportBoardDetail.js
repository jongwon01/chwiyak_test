import { $, id, fmtDateYYYYMMDD, getCurrentUser } from './common.js';

// ✅ 새로고침 파라미터 감지 (수정 후 자동 갱신)
if (window.location.search.includes("refresh=1")) {
  console.log("🔄 수정 후 자동 새로고침 실행");
  const cleanURL = window.location.pathname + "?id=" + id; // refresh=1 제거
  window.location.replace(cleanURL);
}

// ✅ 기본 예시 데이터 (서버 연결 안 될 경우 대비용)
const DEFAULT_POST = {
  board_id: 'demo-1',
  title: '(예시) 배송/환불 관련 문의드립니다',
  content: `안녕하세요, 지난 주에 주문한 제품의 배송 상태가 궁금합니다.
만약 지연된다면 환불 절차는 어떻게 진행되나요?
주문번호: 2025-000123`,
  created_at: '2025-02-15T10:30:00Z',
  authorId: 'u-demo'
};

// ✅ 요소 참조
const titleEl = $('#post-title');
const dateEl = $('#post-date');
const contentEl = $('#post-content');
const actions = $('#owner-actions');
const statusMsg = $('#status-msg');
const hintMsg = $('#hint-msg');

// ✅ 렌더링 함수
function render(post, { usedDefault = false } = {}) {
  titleEl.textContent = post.title || '(제목 없음)';
  dateEl.textContent = fmtDateYYYYMMDD(post.created_at || post.createdAt);
  contentEl.textContent = post.content || '(내용이 없습니다.)';

  if (post.answer) {
    const answerBox = document.createElement('div');
    answerBox.classList.add('mt-6', 'p-4', 'border-t', 'text-gray-700');
    answerBox.innerHTML = `
      <strong>📢 관리자 답변</strong>
      <p class="mt-2 whitespace-pre-line">${post.answer}</p>
    `;
    contentEl.parentNode.appendChild(answerBox);
  }

  if (usedDefault) hintMsg.classList.remove('hidden');
  else hintMsg.classList.add('hidden');
}

// ✅ 버튼 표시 조건 (작성자/관리자)
async function setActionsVisibility(post) {
  const me = await getCurrentUser();

  const isOwner =
    me &&
    (
      String(me.userId) === String(post.buyer_id) ||
      String(me.userId) === String(post.seller_id) ||
      String(me.buyer_id) === String(post.buyer_id) ||
      String(me.seller_id) === String(post.seller_id)
    );

  const isAdmin = me && me.role === 'admin';

  if (isOwner || isAdmin) {
    actions.classList.remove('hidden');

    // ✏️ 수정 버튼
    $('#btn-edit').addEventListener('click', () => {
      location.href = `./supportBoardEdit.html?id=${encodeURIComponent(post.board_id || id)}`;
    });

    // ❌ 삭제 버튼
    $('#btn-delete').addEventListener('click', async () => {
      if (!confirm('정말 삭제하시겠습니까?')) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/supportBoard/${encodeURIComponent(post.board_id || id)}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || '삭제에 실패했습니다.');
        }

        alert('삭제되었습니다.');
        // ✅ 목록으로 이동 + refresh 트리거
        window.location.href = './supportBoard.html?refresh=1';

      } catch (e) {
        console.error('❌ 삭제 오류:', e);
        statusMsg.textContent = e.message || '삭제 중 오류가 발생했습니다.';
        statusMsg.classList.remove('hidden');
      }
    });
  }
}

// ✅ 초기화
(async function init() {
  render(DEFAULT_POST, { usedDefault: true });
  await setActionsVisibility(DEFAULT_POST);

  if (!id) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/supportBoard/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    if (!res.ok) {
      console.warn('❌ 문의글 불러오기 실패:', res.status);
      return;
    }

    const post = await res.json();
    if (!post.board_id) post.board_id = id;

    render(post, { usedDefault: false });
    await setActionsVisibility(post);
  } catch (err) {
    console.error('❌ 문의글 상세 불러오기 오류:', err);
    statusMsg.textContent = '문의글을 불러올 수 없습니다.';
    statusMsg.classList.remove('hidden');
  }
})();

// ✅ 관리자 답변 버튼
$('#btn-answer').addEventListener('click', async () => {
  const answer = prompt('관리자 답변을 입력하세요:');
  if (!answer) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/supportBoard/${encodeURIComponent(id)}/answer`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answer }),
      }
    );

    if (!res.ok) throw new Error('답변 등록에 실패했습니다.');
    alert('답변이 등록되었습니다.');
    location.reload();
  } catch (err) {
    alert(err.message || '오류가 발생했습니다.');
  }
});