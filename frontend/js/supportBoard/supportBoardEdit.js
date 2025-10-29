import { $, id } from './common.js';

// ✅ 기본값 (id 없을 때 대비)
const DEFAULT_TITLE = '예시 제목입니다.';
const DEFAULT_CONTENT = '예시 내용입니다. API 연동 후 실제 내용으로 자동 대체됩니다.';

// 요소 선택
const titleEl   = $('#title');
const contentEl = $('#content');
const statusEl  = $('#status');
const submitBtn = $('#submit-btn');
const cancelA   = $('#cancel-link');

// ✅ 취소 버튼 → 상세 페이지로 이동
if (id) cancelA.href = `./supportBoardDetail.html?id=${encodeURIComponent(id)}`;

// ✅ 기본값 세팅
titleEl.value = DEFAULT_TITLE;
contentEl.value = DEFAULT_CONTENT;

// ✅ 기존 글 불러오기 (수정 전 기존 내용 채우기)
document.addEventListener('DOMContentLoaded', async () => {
  if (!id) {
    statusEl.textContent = '잘못된 접근입니다. (id 없음)';
    statusEl.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/supportBoard/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();

    if (post.title)   titleEl.value = post.title;
    if (post.content) contentEl.value = post.content;
  } catch (err) {
    console.error('❌ 기존 글 불러오기 오류:', err);
    statusEl.textContent = '글을 불러오지 못했습니다.';
    statusEl.classList.remove('hidden');
  }
});

// ✅ 수정 완료 이벤트
$('#edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.classList.add('hidden');
  statusEl.textContent = '';

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title || !content) {
    statusEl.textContent = '제목과 내용을 모두 입력해 주세요.';
    statusEl.classList.remove('hidden');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '저장 중...';

  try {
    const res = await fetch(`http://localhost:5000/api/supportBoard/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || '수정에 실패했습니다.');
    }

    alert('수정이 완료되었습니다.');

    // ✅ 수정 완료 후 목록 페이지로 이동 + 자동 새로고침
    window.location.href = './supportBoard.html?refresh=1';

  } catch (err) {
    console.error('❌ 수정 오류:', err);
    statusEl.textContent = err.message || '오류가 발생했습니다.';
    statusEl.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '수정 완료';
  }
});