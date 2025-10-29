// 공통 헬퍼/유틸들 (ES Module)
export const $ = (sel, el = document) => el.querySelector(sel);

export const params = new URLSearchParams(location.search);
export const id = params.get('id'); // 상세/수정 페이지에서 사용

export function fmtDateYYYYMMDD(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(+d)) return '—';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 현재 로그인 사용자 조회 (백엔드 준비되면 /api/auth/me로 교체)
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("⚠️ 사용자 정보를 불러올 수 없습니다:", err);
    return null;
  }
}
