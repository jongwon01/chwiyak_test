// /frontend/js/seller-product-list.js

document.addEventListener('DOMContentLoaded', () => {
  const $list  = document.getElementById('productList');
  const $empty = document.getElementById('emptyState');

  // 1) URL 쿼리에서 user_id 가져오기 (기본값은 링크에서 넣음)
  const params = new URLSearchParams(window.location.search);
  const sellerId = Number(params.get('user_id')); // default 값 : 10000


  // 2) MockData에서 객체들을 안전하게 가져오기
  const MD = window.MockData || {};
  const { 
    productTop, 
    productBottoms, 
    productAccessory, 
    productBeauty, 
    productShoes, 
    productBag 
  } = MD;

  // 3) 객체 → 배열 변환 후 합치기
  const toArr = (obj) => (obj && typeof obj === 'object') ? Object.values(obj) : [];

  // 모든 상품 합치기 (객체 기반이므로 Object.values 사용!)
  const all = [
    ...toArr(productTop),
    ...toArr(productBottoms),
    ...toArr(productAccessory),
    ...toArr(productBeauty),
    ...toArr(productShoes),
    ...toArr(productBag),
  ];

  // 3) 필터: 내 상품만
  const mine = all.filter(p => Number(p?.user_id) === sellerId);

  if (!mine.length) {
    $empty.classList.remove('hidden');
    return;
  }

  // 4) 렌더: 텍스트 + 수평선만 (행마다 hr)
  mine.forEach((p, idx) => {
    // 행 컨테이너 (박스 스타일 X)
    const row = document.createElement('div');
    row.className = "py-4";

    // 한 줄 레이아웃: 이름 | 이미지 | 가격 | 설명 | 수정 | 삭제
    const line = document.createElement('div');
    line.className = "grid grid-cols-[1fr_96px_120px_2.75fr_auto] gap-4 items-center px-2 sm:px-3";

    // 이름 (가로/세로 중앙)
    const nameEl = document.createElement('div');
    nameEl.className = "text-center font-medium";
    nameEl.textContent = p.name ?? "(이름 없음)";

    // 이미지 (가로/세로 중앙, 64x64)
    const imgEl = document.createElement('div');
    imgEl.className = "flex items-center justify-center";
    const imgWrap = document.createElement('div');
    imgWrap.className = "w-24 h-24 rounded overflow-hidden bg-slate-100 flex items-center justify-center";
    const img = document.createElement('img');
    img.className = "w-full h-full object-cover";
    img.alt = "상품 이미지";
    const firstImg = (p.images && p.images[0]) ? p.images[0] : "";
    if (firstImg) img.src = firstImg;
    imgWrap.appendChild(img);
    imgEl.appendChild(imgWrap);

    // 가격 (가로/세로 중앙)
    const priceEl = document.createElement('div');
    priceEl.className = "text-center";
    const price = Number(p.price ?? 0);
    priceEl.textContent = price ? price.toLocaleString('ko-KR') + "원" : "-";

    // 상세 설명 (좌측 정렬)
    const descEl = document.createElement('div');
    descEl.className = "text-left text-sm leading-5 text-slate-700 break-words";
    descEl.textContent = p.description ?? "(설명 없음)";

    const actionsEl = document.createElement('div');
    actionsEl.className = "flex items-center justify-center gap-0.5"; // 더 촘촘: gap-0.5

    const editBtn = document.createElement('button');
    editBtn.type = "button";
    editBtn.className = "px-2.5 py-1.5 rounded-md text-sm font-medium bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200";
    editBtn.textContent = "수정";
    editBtn.addEventListener('click', () => {
      alert(`수정(임시): ${p.id}`);
    });

    const delBtn = document.createElement('button');
    delBtn.type = "button";
    delBtn.className = "px-2.5 py-1.5 rounded-md text-sm font-medium bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200";
    delBtn.textContent = "삭제";
    delBtn.addEventListener('click', () => {
      if (!confirm(`정말 삭제하시겠습니까?\n[${p.name}]`)) return;
      row.remove();
      if (!$list.querySelector('div.grid')) $empty.classList.remove('hidden');
    });

    actionsEl.append(editBtn, delBtn);

    // 조립
    line.appendChild(nameEl);
    line.appendChild(imgEl);
    line.appendChild(priceEl);
    line.appendChild(descEl);
    line.appendChild(actionsEl);
    row.appendChild(line);

    // 행 구분 수평선
    const hr = document.createElement('hr');
    hr.className = "mt-4 border-slate-200";

    $list.appendChild(row);
    if (idx < mine.length - 1) $list.appendChild(hr);
  });
});
