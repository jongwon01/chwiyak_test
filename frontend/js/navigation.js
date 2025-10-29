document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("navigation");
  if (!mount) return;

  const src = mount.getAttribute("data-src");
  if (!src) {
    console.error("[navigation] data-src가 없습니다.");
    return;
  }

  try {
    const res = await fetch(src, { cache: "no-cache" });
    if (!res.ok) throw new Error(`[nav] fetch 실패 ${res.status}`);

    // ✅ navigation.html 내용을 삽입
    mount.innerHTML = await res.text();

    // ------------------------------
    // ✅ 로그인 상태에 따른 메뉴 표시
    // ------------------------------
    const navUtil = document.getElementById("nav-util");
    if (navUtil) {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (token) {
        let myPageLink = "/frontend/pages/mypage/mypage.html";
        if (userType === "seller") {
          myPageLink = "/frontend/pages/seller/seller.html";
        }

        navUtil.innerHTML = `
          <a href="/frontend/pages/notice/notice.html">공지사항</a>
          <a href="/frontend/pages/supportBoard/supportBoard.html">문의사항</a>
          <a href="/frontend/pages/FAQ/FAQ.html">FAQ</a>
          <a href="${myPageLink}">마이페이지</a>
          <a href="#" id="logout-btn">로그아웃</a>
        `;

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("로그아웃하시겠습니까?")) {
              localStorage.removeItem("token");
              localStorage.removeItem("userType");
              localStorage.removeItem("username");
              alert("로그아웃되었습니다.");
              window.location.href = "/frontend/pages/main.html";
            }
          });
        }
      }
    }

    // ------------------------------
    // ✅ 아이콘 렌더링 (Lucide)
    // ------------------------------
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    // ------------------------------
    // ✅ 네비 높이에 맞춰 body 여백 보정
    // ------------------------------
    const navEl = document.querySelector("header.nav");
    if (navEl) {
      const setPT = () => (document.body.style.paddingTop = `${navEl.offsetHeight}px`);
      setPT();
      window.addEventListener("resize", setPT);
    }

    // ------------------------------
    // ✅ 검색폼 이벤트 등록 (중복방지 & 절대경로)
    // ------------------------------
    setTimeout(() => {
      const form = document.querySelector("#siteSearchForm");
      const input = form?.querySelector("input[name='q']");
      if (!form || !input) {
        console.warn("검색폼을 찾을 수 없습니다.");
        return;
      }

      // JS 이벤트 추가 (action 있음에도 안전하게 제어)
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        const targetUrl = `${window.location.origin}/frontend/pages/category/search.html?q=${encodeURIComponent(q)}`;
        console.log("🔍 검색 이동:", targetUrl);
        window.location.href = targetUrl;
      });

      console.log("✅ 검색 이벤트 연결 완료");
    }, 300);

  } catch (err) {
    console.error("[navigation] 로드 실패:", err);
  }
});
