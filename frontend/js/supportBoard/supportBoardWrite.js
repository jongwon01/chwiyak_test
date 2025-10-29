import { $ } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = $('#write-form');
  const statusEl = $('#status');
  const submitBtn = $('#submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.classList.add('hidden');
    statusEl.textContent = '';

    const title = $('#title').value.trim();
    const content = $('#content').value.trim();
    if (!title || !content) {
      statusEl.textContent = '제목과 내용을 모두 입력해 주세요.';
      statusEl.classList.remove('hidden');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      statusEl.textContent = '로그인이 필요합니다.';
      statusEl.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    try {
      const res = await fetch('http://localhost:5000/api/supportBoard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const msg = (await res.text()) || '등록에 실패했습니다.';
        throw new Error(msg);
      }

      // ✅ 작성 완료 → "목록" 절대경로로 이동 (호스트가 바뀌어도 안전)
      // ✅ 작성 완료 → 목록 페이지로 이동 (현재 서버 기준)
    window.location.href = `${window.location.origin}/frontend/pages//supportBoard/supportBoard.html`;



    } catch (err) {
      statusEl.textContent = err.message || '오류가 발생했습니다.';
      statusEl.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '작성 완료';
    }
  });
});