const QNA_API = "http://localhost:5000/api/supportBoard";
const $list = document.getElementById("qna-list");
const $loading = document.getElementById("qna-loading");

// ✅ refresh 파라미터 감지 시 새로고침 유도
if (window.location.search.includes("refresh=1")) {
  console.log("🔄 삭제 이후 목록 새로고침 실행");
  window.location.replace(window.location.pathname);
}

// 날짜 포맷
function fmtYMD(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (isNaN(d)) return "-";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ✅ 렌더링
function render(items) {
  $list.innerHTML = "";

  if (!items || !items.length) {
    $list.innerHTML = `<li class="px-4 py-8 text-center text-gray-500">표시할 글이 없습니다.</li>`;
    return;
  }

  items.sort((a, b) => (Number(b.board_id) || 0) - (Number(a.board_id) || 0));

  for (const it of items) {
    const li = document.createElement("li");
    li.className =
      "hover:bg-gray-50 transition grid grid-cols-[64px_1fr_140px_160px] items-center px-2 sm:px-4 py-4";
    li.innerHTML = `
      <div class="text-center text-gray-700">${it.board_id ?? ""}</div>
      <a href="./supportBoardDetail.html?id=${it.board_id}"
         class="truncate text-left text-gray-900 hover:underline">
         ${it.title ?? "(제목 없음)"}
      </a>
      <div class="text-center text-gray-700">${it.author_name ?? "익명"}</div>
      <div class="text-center text-gray-500">${fmtYMD(it.created_at)}</div>
    `;
    $list.appendChild(li);
  }
}

// ✅ 목록 불러오기
async function load() {
  try {
    if ($loading) $loading.remove();

    const res = await fetch(QNA_API, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items || [];
    render(items);
  } catch (e) {
    console.warn("❌ QnA API 실패, mock 데이터 사용:", e);
    render([
      {
        board_id: 1,
        title: "프로젝트 구조 공지",
        author_name: "admin",
        created_at: Date.now() - 86400_000,
      },
      {
        board_id: 2,
        title: "Tailwind 빌드 경로 확인",
        author_name: "sora",
        created_at: Date.now() - 7200_000,
      },
    ]);
  }
}

document.addEventListener("DOMContentLoaded", load);