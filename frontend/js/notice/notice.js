const NOTICE_API = "/api/notice?offset=0&limit=20";

const $list = document.getElementById("notice-list");
const $loading = document.getElementById("notice-loading");

function fmtYMD(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function render(items) {
  $list.innerHTML = "";

  if (!items?.length) {
    $list.innerHTML = `<li class="px-4 py-8 text-center text-gray-500">등록된 공지사항이 없습니다.</li>`;
    return;
  }

  items.sort((a, b) => (Number(b.no) || 0) - (Number(a.no) || 0));

  for (const it of items) {
    const li = document.createElement("li");
    li.className =
      "hover:bg-gray-50 transition grid grid-cols-[64px_1fr_140px_160px] items-center px-2 sm:px-4 py-4 cursor-pointer";

    li.innerHTML = `
      <div class="text-center text-gray-700">${it.no ?? ""}</div>
      <div class="truncate text-left text-gray-900 font-medium hover:underline">${it.title ?? "(제목 없음)"}</div>
      <div class="text-center text-gray-700">${it.author ?? "관리자"}</div>
      <div class="text-center text-gray-500">${it.createdAt ? fmtYMD(it.createdAt) : "-"}</div>
    `;

    li.addEventListener("click", () => {
      window.location.href = `notice_detail.html?id=${it.no}`;
    });

    $list.appendChild(li);
  }
}

async function load() {
  try {
    if ($loading) $loading.remove();

    const res = await fetch(NOTICE_API, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const items = (Array.isArray(data) ? data : data.items || []).map((x, i) => ({
      no: x.no ?? x.id ?? i + 1,
      title: x.title,
      author: x.author || "관리자",
      createdAt: x.createdAt || Date.now(),
      content: x.content || "",
    }));

    render(items);
  } catch (e) {
    console.warn("공지사항 API 실패, mock 데이터 사용:", e);
    render([
      { no: 3, title: "10월 신규회원 이벤트 안내", author: "관리자", createdAt: Date.now() - 86400_000, content: "10월 한정 신규회원 이벤트가 진행됩니다." },
      { no: 2, title: "배송 정책 변경 공지", author: "관리자", createdAt: Date.now() - 7200_000, content: "배송 정책이 일부 변경되었습니다." },
      { no: 1, title: "PREAM 오픈 기념 할인 행사", author: "관리자", createdAt: Date.now() - 3600_000, content: "오픈 기념으로 할인 행사를 진행합니다." },
    ]);
  }
}

document.addEventListener("DOMContentLoaded", load);