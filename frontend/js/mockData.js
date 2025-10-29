(function (w) {
  const KRW = (n) => Number(n);
  const BRANDS = ["LOUISVUITTON", "GUCCI", "CHANEL", "PRADA", "HERMES"];

  // 브랜드별 이미지 경로 자동 생성 함수
  const IMG = {
    bag: (i) => BRANDS.map((b) => `/frontend/public/bags/${b}_bag${i}.jpg`),
    accessory: (i) => BRANDS.map((b) => `/frontend/public/accessories/${b}_accessory${i}.jpg`),
    beauty: (i) => BRANDS.map((b) => `/frontend/public/beauty/${b}_beauty${i}.jpg`),
    top: (i) => BRANDS.map((b) => `/frontend/public/top/${b}_top${i}.jpg`),
    bottoms: (i) => BRANDS.map((b) => `/frontend/public/bottoms/${b}_bottoms${i}.jpg`),
    shoes: (i) => BRANDS.map((b) => `/frontend/public/shoes/${b}_shoes${i}.jpg`),
  };

  // 각 카테고리 리스트 (단순)
  const categoryBag = {
    // LOUISVUITTON
    "101": { id: "101", name: "스피디 반둘리에 25", price: KRW(2680000) },
    "102": { id: "102", name: "알마 BB", price: KRW(2680000) },
    "103": { id: "103", name: "올 인 BB", price: KRW(3500000) },
    "104": { id: "104", name: "네오노에 BB", price: KRW(3050000) },
  };

  const categoryAccessory = {
    "201": { id: "201", name: "모노그램 스카프", price: KRW(520000) },
    "202": { id: "202", name: "로고 카드홀더", price: KRW(380000) },
    "203": { id: "203", name: "실버 브레이슬릿", price: KRW(640000) },
    "204": { id: "204", name: "레더 키링", price: KRW(210000) },
  };

  const categoryBeauty = {
    "301": { id: "301", name: "루미너스 립밤", price: KRW(68000) },
    "302": { id: "302", name: "소프트 블러쉬", price: KRW(78000) },
    "303": { id: "303", name: "바이탈 세럼", price: KRW(125000) },
    "304": { id: "304", name: "스킨 쿠션", price: KRW(89000) },
  };

  const categoryTop = {
    "401": { id: "401", name: "케이블 니트 가디건", price: KRW(690000) },
    "402": { id: "402", name: "옥스포드 셔츠", price: KRW(210000) },
    "403": { id: "403", name: "로고 스웻셔츠", price: KRW(180000) },
    "404": { id: "404", name: "울 블레이저", price: KRW(780000) },
  };

  const categoryBottoms = {
    "501": { id: "501", name: "레더 팬츠", price: KRW(980000) },
    "502": { id: "502", name: "테이퍼드 데님", price: KRW(190000) },
    "503": { id: "503", name: "다미에 데님 스케이트 팬츠", price: KRW(2720000) },
    "504": { id: "504", name: "LV 데님 쇼츠", price: KRW(1620000) },
  };

  const categoryShoes = {
    "601": { id: "601", name: "러너 스니커즈", price: KRW(350000) },
    "602": { id: "602", name: "레더 로퍼", price: KRW(520000) },
    "603": { id: "603", name: "앵클 부츠", price: KRW(890000) },
    "604": { id: "604", name: "트랙 샌들", price: KRW(420000) },
  };

  // 상세 Mock (대표 이미지 1세트 + 전체 브랜드 버전)
  const productBag = {
    // LOUISVUITTON
    "101": { id: "101", category: "bag", brand: "LOUISVUITTON", name: "스피디 반둘리에 25", price: 2680000, sku: "SPD25-MONO", description: "아이코닉한 모노그램 캔버스.", images: IMG.bag(1), tags: [] },
    "102": { id: "102", category: "bag", brand: "LOUISVUITTON", name: "알마 BB", price: 2680000, sku: "ALMA-BB", description: "아르데코 감성의 토트.", images: IMG.bag(2), tags: [] },
    "103": { id: "103", category: "bag", brand: "LOUISVUITTON", name: "올 인 BB", price: 3500000, sku: "ALLIN-BB", description: "실용적인 버킷 스타일.", images: IMG.bag(3), tags: [] },
    "104": { id: "104", category: "bag", brand: "LOUISVUITTON", name: "네오노에 BB", price: 3050000, sku: "NEO-NOE-BB", description: "숄더/크로스 연출 가능.", images: IMG.bag(4), tags: [] },

    // PRADA 
    "105": { id: "105", category: "bag", brand: "PRADA", name: "갤러리아 사피아노 가죽 핸드백", price: 2680000, sku: "SPD25-MONO", description: "실용적인 미를 추구", images: IMG.bag(1), tags: [] },
    "106": { id: "106", category: "bag", brand: "PRADA", name: "라나일론 백팩", price: 2680000, sku: "ALMA-BB", description: "아르데코 감성의 토트.", images: IMG.bag(2), tags: [] },
    "107": { id: "107", category: "bag", brand: "PRADA", name: "익스플로어 리나일론 숄더백", price: 3500000, sku: "ALLIN-BB", description: "실용적인 버킷 스타일.", images: IMG.bag(3), tags: [] },
    "108": { id: "108", category: "bag", brand: "PRADA", name: "익스플로어 나파 가죽 핸드백", price: 3050000, sku: "NEO-NOE-BB", description: "숄더/크로스 연출 가능.", images: IMG.bag(4), tags: [] },

    // HERMES 
    "109": { id: "109", category: "bag", brand: "HERMES", name: "P'tit Arcon 백", price: 7410000, sku: "SPD25-MONO", description: "끌레망스 불카프 가죽 및 스위프트 카프스킨 소재의 백", images: IMG.bag(1), tags: [] },
    "110": { id: "110", category: "bag", brand: "HERMES", name: "Hermès In-The-Loop 18 백 ", price: 7120000, sku: "ALMA-BB", description: "캔버스 및 스위프트 카프스킨 소재의 백", images: IMG.bag(2), tags: [] },
    "111": { id: "111", category: "bag", brand: "HERMES", name: "Mini Medor 백 ", price: 8780000, sku: "ALLIN-BB", description: "엡솜 카프스킨 소재의 백", images: IMG.bag(3), tags: [] },
    "112": { id: "112", category: "bag", brand: "HERMES", name: "Petite Course 백", price: 7700000, sku: "NEO-NOE-BB", description: "엡솜 카프스킨 소재의 백", images: IMG.bag(4), tags: [] },

    // CHANEL
    "113": { id: "113", category: "bag", brand: "CHANEL", name: "클래식 11.12 백", price: 16010000, sku: "QH-21", description: "자수 장식 새틴, 시퀸, 글래스 비즈, 골드 메탈 브라운, 골드", images: IMG.bag(1), tags: [] },
    "114": { id: "114", category: "bag", brand: "CHANEL", name: "클래식 스몰 플랩 백", price: 16010000, sku: "MX-74", description: "코튼 트위드, 골드 메탈 블랙", images: IMG.bag(2), tags: [] },
    "115": { id: "116", category: "bag", brand: "CHANEL", name: "라지 플랩 백", price: 9630000, sku: "DL-58", description: "트위드, 시어링 램스킨, 골드메탈 블랙, 그레이", images: IMG.bag(3), tags: [] },
    "116": { id: "116", category: "bag", brand: "CHANEL", name: "플랩 백", price: 9460000, sku: "TR-11", description: "유광 그레인드 카프스킨, 골드 메탈 라이트 핑크", images: IMG.bag(4), tags: [] },
  };

  const productAccessory = {
    // LOUISVUITTON
    "201": { id: "201", category: "accessory", brand: "LOUISVUITTON", name: "모노그램 스카프", price: 520000, sku: "SCARF-MONO", description: "가벼운 소재의 스카프.", images: IMG.accessory(1), tags: [] },
    "202": { id: "202", category: "accessory", brand: "LOUISVUITTON", name: "로고 카드홀더", price: 240000, sku: "CARD-LOGO", description: "슬림한 수납의 카드홀더.", images: IMG.accessory(2), tags: [] },
    "203": { id: "203", category: "accessory", brand: "LOUISVUITTON", name: "실버 브레이슬릿", price: 740000, sku: "BRACE-SLV", description: "미니멀 실버 체인.", images: IMG.accessory(3), tags: [] },
    "204": { id: "204", category: "accessory", brand: "LOUISVUITTON", name: "레더 키링", price: 210000, sku: "KEYRING-LTH", description: "로고 각인 키링.", images: IMG.accessory(4), tags: [] },

    
    // PRADA 
    "205": { id: "205", category: "accessory", brand: "PRADA", name: "쿠뢰르 비방드 팬던트 댕글 이어링", price: 520000, sku: "SCARF-MONO", description: "최대의 미를 추구하는 이어링", images: IMG.accessory(1), tags: [] },
    "206": { id: "206", category: "accessory", brand: "PRADA", name: "쿠뢰르 비방뜨 솔리테어 링", price: 240000, sku: "CARD-LOGO", description: "슬림한 수납의 카드홀더.", images: IMG.accessory(2), tags: [] },
    "207": { id: "207", category: "accessory", brand: "PRADA", name: "리본 뱅글 팔찌", price: 740000, sku: "BRACE-SLV", description: "미니멀 골드 팔찌", images: IMG.accessory(3), tags: [] },
    "208": { id: "208", category: "accessory", brand: "PRADA", name: "리본 뱅글 링", price: 210000, sku: "KEYRING-LTH", description: "미니멀 골드 링", images: IMG.accessory(4), tags: [] },


    // HERMES
    "209": { id: "209", category: "accessory", brand: "HERMES", name: "Chaine d'ancre Enchainee 더블 브레이슬릿", price: 20170000, sku: "SCARF-MONO", description: "로즈 골드 소재의 더블 브레이슬릿", images: IMG.accessory(1), tags: [] },
    "210": { id: "210", category: "accessory", brand: "HERMES", name: "Echappee Hermès 링, 스몰 모델", price: 11070000, sku: "CARD-LOGO", description: "다이아몬드가 세팅된 로즈 골드 소재의 링", images: IMG.accessory(2), tags: [] },
    "211": { id: "211", category: "accessory", brand: "HERMES", name: "Farandole 이어링, 엑스 스몰 모델", price: 4730000, sku: "BRACE-SLV", description: "다이아몬드가 세팅된 로즈 골드 소재의 이어링", images: IMG.accessory(3), tags: [] },
    "212": { id: "212", category: "accessory", brand: "HERMES", name: "Farandole 펜던트, 스몰 모델", price: 13390000, sku: "KEYRING-LTH", description: "토글 클래스프 디테일과 다이아몬드가 장식된 로즈 골드 소재의 펜던트", images: IMG.accessory(4), tags: [] },


    // CHANEL
    "213": { id: "213", category: "accessory", brand: "CHANEL", name: "Coco Crush 링", price: 4900000, sku: "QN-27", description: "18K 베이지 골드로 이루어진 퀼팅 모티브 링, 스몰 모델", images: IMG.accessory(1), tags: [] },
    "214": { id: "214", category: "accessory", brand: "CHANEL", name: "Coco Crush 브레이슬릿", price: 22900000, sku: "ZP-83", description: "18K 화이트 골드와 다이아몬드로 이루어진 퀼팅 모티브 브레이슬릿", images: IMG.accessory(2), tags: [] },
    "215": { id: "215", category: "accessory", brand: "CHANEL", name: "Coco Crush 이어링", price: 6620000, sku: "LM-46", description: "18K 베이지 골드로 이루어진 퀼팅 모티브 이어링", images: IMG.accessory(3), tags: [] },
    "216": { id: "216", category: "accessory", brand: "CHANEL", name: "COCO 네크리스", price: 9960000, sku: "RT-09", description: "18K 베이지 골드와 다이아몬드로 이루어진 퀼팅 모티프 네크리스", images: IMG.accessory(4), tags: [] },
  };

  const productBeauty = {
    // LOUISVUITTON
    "301": { id: "301", category: "beauty", brand: "LOUISVUITTON", name: "루미너스 립밤", price: 68000, sku: "LIP-01", description: "은은한 광택 립밤.", images: IMG.beauty(1), tags: [] },
    "302": { id: "302", category: "beauty", brand: "LOUISVUITTON", name: "소프트 블러쉬", price: 78000, sku: "BLUSH-01", description: "자연스러운 혈색의 블러셔.", images: IMG.beauty(2), tags: [] },
    "303": { id: "303", category: "beauty", brand: "LOUISVUITTON", name: "바이탈 세럼", price: 125000, sku: "SERUM-01", description: "촉촉하고 탄력 있는 세럼.", images: IMG.beauty(3), tags: [] },
    "304": { id: "304", category: "beauty", brand: "LOUISVUITTON", name: "스킨 쿠션", price: 89000, sku: "CUSHION-01", description: "가벼운 커버 쿠션.", images: IMG.beauty(4), tags: [] },

    // PRADA 
    "305": { id: "305", category: "beauty", brand: "PRADA", name: "루미너스 립밤", price: 68000, sku: "LIP-01", description: "은은한 광택 립밤.", images: IMG.beauty(1), tags: [] },
    "306": { id: "306", category: "beauty", brand: "PRADA", name: "소프트 블러쉬", price: 78000, sku: "BLUSH-01", description: "자연스러운 혈색의 블러셔.", images: IMG.beauty(2), tags: [] },
    "307": { id: "307", category: "beauty", brand: "PRADA", name: "바이탈 세럼", price: 125000, sku: "SERUM-01", description: "촉촉하고 탄력 있는 세럼.", images: IMG.beauty(3), tags: [] },
    "308": { id: "308", category: "beauty", brand: "PRADA", name: "스킨 쿠션", price: 89000, sku: "CUSHION-01", description: "가벼운 커버 쿠션.", images: IMG.beauty(4), tags: [] },

    // HERMES 
    "309": { id: "309", category: "beauty", brand: "HERMES", name: "Rouge Hermes 새틴 립스틱, 리미티드 에디션, 로즈 모브", price: 112000, sku: "LIP-01", description: "55 – 로즈 모브", images: IMG.beauty(1), tags: [] },
    "310": { id: "310", category: "beauty", brand: "HERMES", name: " 로즈 프리메르 마뜨 레제", price: 112000, sku: "BLUSH-01", description: "69 – 로즈 프리메르", images: IMG.beauty(2), tags: [] },
    "311": { id: "311", category: "beauty", brand: "HERMES", name: "옹브르 옵티크", price: 162000, sku: "SERUM-01", description: "12 – 옹브르 옵티끄", images: IMG.beauty(3), tags: [] },
    "312": { id: "312", category: "beauty", brand: "HERMES", name: "로즈 아브리꼬", price: 110000, sku: "CUSHION-01", description: "19 – 로즈 아브리꼬", images: IMG.beauty(4), tags: [] },


    // CHANEL
    "313": { id: "313", category: "beauty", brand: "CHANEL", name: "레 네프 옹브르", price: 190000, sku: "KS-52", description: "강렬한 아이섀도우 팔레트", images: IMG.beauty(1), tags: [] },
    "314": { id: "314", category: "beauty", brand: "CHANEL", name: "수블리마지 쿠션", price: 300000, sku: "DW-31", description: "샤넬 수블리마지 쿠션: 우아하게 빛나는 고결한 광채", images: IMG.beauty(2), tags: [] },
    "315": { id: "315", category: "beauty", brand: "CHANEL", name: "코코 마드모아젤", price: 164000, sku: "JQ-65", description: "프래그런스 프라이머", images: IMG.beauty(3), tags: [] },
    "316": { id: "316", category: "beauty", brand: "CHANEL", name: "루쥬 알뤼르 벨벳", price: 59000, sku: "PL-88", description: "대담한 컬러를 연출하는 루미너스 매트 립스틱", images: IMG.beauty(4), tags: [] },
  };

  const productTop = {
    // LOUISVUITTON
    "401": { id: "401", category: "top", brand: "LOUISVUITTON", name: "케이블 니트 가디건", price: 690000, sku: "CD-01", description: "부드러운 터치의 니트.", images: IMG.top(1), tags: [] },
    "402": { id: "402", category: "top", brand: "LOUISVUITTON", name: "옥스포드 셔츠", price: 210000, sku: "SH-01", description: "클래식 옥스포드 셔츠.", images: IMG.top(2), tags: [] },
    "403": { id: "403", category: "top", brand: "LOUISVUITTON", name: "로고 스웻셔츠", price: 180000, sku: "SW-01", description: "루즈핏 로고 스웻셔츠.", images: IMG.top(3), tags: [] },
    "404": { id: "404", category: "top", brand: "LOUISVUITTON", name: "울 블레이저", price: 780000, sku: "BL-01", description: "스트럭처드 울 블레이저.", images: IMG.top(4), tags: [] },

    // PRADA 
    "405": { id: "405", category: "top", brand: "PRADA", name: "크롭 패딩", price: 690000, sku: "CD-01", description: "부드러운 터치의 니트.", images: IMG.top(1), tags: [] },
    "406": { id: "406", category: "top", brand: "PRADA", name: "화이트 스노우 패딩", price: 210000, sku: "SH-01", description: "클래식 옥스포드 셔츠.", images: IMG.top(2), tags: [] },
    "407": { id: "407", category: "top", brand: "PRADA", name: "네이비 리더 재킷", price: 180000, sku: "SW-01", description: "루즈핏 로고 스웻셔츠.", images: IMG.top(3), tags: [] },
    "408": { id: "408", category: "top", brand: "PRADA", name: "클래식 패딩", price: 780000, sku: "BL-01", description: "스트럭처드 울 블레이저.", images: IMG.top(4), tags: [] },

    //  HERMES
    "409": { id: "409", category: "top", brand: "HERMES", name: "Coloriages de Jour 셔츠", price: 5770000, sku: "CD-01", description: "Coloriages de Jour” 프린티드 실크 스카프 소재의 셔츠(실크 100%)", images: IMG.top(1), tags: [] },
    "410": { id: "410", category: "top", brand: "HERMES", name: "Palefroi Remix 클래식 셔츠", price: 5940000, sku: "SH-01", description: "Palefroi Remix” 프린티드 실크 스카프 소재의 클래식 셔츠(실크 100%)", images: IMG.top(2), tags: [] },
    "411": { id: "411", category: "top", brand: "HERMES", name: "드레이프 칼라 셔츠", price: 800000, sku: "SW-01", description: "코튼 트윌 소재의 셔츠(코튼 100%)", images: IMG.top(3), tags: [] },
    "412": { id: "412", category: "top", brand: "HERMES", name: "승마 재킷", price: 10310000, sku: "BL-01", description: "더블 사이드 캐시미어 소재의 재킷(캐시미어 100%)", images: IMG.top(4), tags: [] },


    // CHANEL
    "413": { id: "413", category: "top", brand: "CHANEL", name: "트위드 재킷", price: 10810000, sku: "GV-40", description: "베이지, 화이트", images: IMG.top(1), tags: [] },
    "414": { id: "414", category: "top", brand: "CHANEL", name: "벨티드 재킷", price: 19430000, sku: "RX-77", description: "캐시미어 블랙, 화이트", images: IMG.top(2), tags: [] },
    "415": { id: "415", category: "top", brand: "CHANEL", name: "실크 오간자 재킷", price: 22640000, sku: "CE-22", description: "블랙", images: IMG.top(3), tags: [] },
    "416": { id: "416", category: "top", brand: "CHANEL", name: "풀오버 가디건", price: 5240000, sku: "MU-19", description: "2025/26 코코 네쥬 컬렉션 울 에크루, 블랙", images: IMG.top(4), tags: [] },
  };

  const productBottoms = {
    // LOUISVUITTON
    "501": { id: "501", category: "bottoms", brand: "LOUISVUITTON", name: "레더 팬츠", price: 980000, sku: "LP-01", description: "슬림 스트레이트 레더.", images: IMG.bottoms(1), tags: [] },
    "502": { id: "502", category: "bottoms", brand: "LOUISVUITTON", name: "테이퍼드 데님", price: 190000, sku: "DN-01", description: "테이퍼드 핏 데님.", images: IMG.bottoms(2), tags: [] },
    "503": { id: "503", category: "bottoms", brand: "LOUISVUITTON", name: "다미에 스케이트 팬츠", price: 2720000, sku: "SL-01", description: "와이드핏 슬랙스.", images: IMG.bottoms(3), tags: [] },
    "504": { id: "504", category: "bottoms", brand: "LOUISVUITTON", name: "LV 데님 쇼츠", price: 1620000, sku: "SK-01", description: "플리츠 데님 쇼츠.", images: IMG.bottoms(4), tags: [] },

    // PRADA 
    "505": { id: "505", category: "bottoms", brand: "PRADA", name: "클래식 숏 스커트", price: 980000, sku: "LP-01", description: "슬림 스트레이트 레더.", images: IMG.bottoms(1), tags: [] },
    "506": { id: "506", category: "bottoms", brand: "PRADA", name: "테이퍼드 데님", price: 190000, sku: "DN-01", description: "테이퍼드 핏 데님.", images: IMG.bottoms(2), tags: [] },
    "507": { id: "507", category: "bottoms", brand: "PRADA", name: "네이비 골덴 팬츠", price: 2720000, sku: "SL-01", description: "와이드핏 슬랙스.", images: IMG.bottoms(3), tags: [] },
    "508": { id: "508", category: "bottoms", brand: "PRADA", name: "화이트 골덴 팬츠", price: 1620000, sku: "SK-01", description: "플리츠 데님 쇼츠.", images: IMG.bottoms(4), tags: [] },

    // HERMES
    "509": { id: "509", category: "bottoms", brand: "HERMES", name: "부츠컷 팬츠", price: 2100000, sku: "LA-12", description: "더블 스트레치 코튼 트윌 소재의 부츠컷 팬츠(코튼 96%, 엘라스탄 4%)", images: IMG.bottoms(1), tags: [] },
    "510": { id: "510", category: "bottoms", brand: "HERMES", name: "Chaine dAncre 부츠컷 팬츠", price: 3150000, sku: "VF-88", description: "“Chaine d'Ancre” 프린티드 코튼 H 캔버스 소재의 부츠컷 팬츠(코튼 98%, 엘라스탄 2%)", images: IMG.bottoms(2), tags: [] },
    "511": { id: "511", category: "bottoms", brand: "HERMES", name: "Candy Libris Bandana 쇼트 팬츠", price: 4720000, sku: "GD-74", description: "미묘한 색감이 특징인 “Candy Libris Bandana” 프린티드 실크 소재의 쇼트 팬츠(실크 100%)", images: IMG.bottoms(3), tags: [] },
    "512": { id: "512", category: "bottoms", brand: "HERMES", name: "버튼 장식 미디 슬릿 스커트", price: 4190000, sku: "KP-39", description: "립 스티치가 특징인 플레인 스코티시 캐시미어 니트 소재의 미디 스커트(캐시미어 98%, 폴리아미드 1%, 엘라스탄 1%)", images: IMG.bottoms(4), tags: [] },

    // CHANEL
    "513": { id: "513", category: "bottoms", brand: "CHANEL", name: "트위드 쇼츠", price: 6080000, sku: "BN-73", description: "핑크, 블랙, 화이트", images: IMG.bottoms(1), tags: [] },
    "514": { id: "514", category: "bottoms", brand: "CHANEL", name: "트위드 팬츠", price: 7940000, sku: "YA-06", description: "화이트, 블랙", images: IMG.bottoms(2), tags: [] },
    "515": { id: "515", category: "bottoms", brand: "CHANEL", name: "코튼 포플린 팬츠", price: 3210000, sku: "WK-58", description: "화이트", images: IMG.bottoms(3), tags: [] },
    "516": { id: "516", category: "bottoms", brand: "CHANEL", name: "코튼 벨벳-스트라스 팬츠", price: 6080000, sku: "HP-14", description: "블루", images: IMG.bottoms(4), tags: [] },
  };

  const productShoes = {
    // LOUISVUITTON
    "601": { id: "601", category: "shoes", brand: "LOUISVUITTON", name: "러너 스니커즈", price: 350000, sku: "SH-RUN-01", description: "경량 솔의 데일리 러너.", images: IMG.shoes(1), tags: [] },
    "602": { id: "602", category: "shoes", brand: "LOUISVUITTON", name: "레더 로퍼", price: 520000, sku: "SH-LOAF-01", description: "풀그레인 레더 로퍼.", images: IMG.shoes(2), tags: [] },
    "603": { id: "603", category: "shoes", brand: "LOUISVUITTON", name: "앵클 부츠", price: 890000, sku: "SH-BOOT-01", description: "사이드 지퍼 앵클 부츠.", images: IMG.shoes(3), tags: [] },
    "604": { id: "604", category: "shoes", brand: "LOUISVUITTON", name: "트랙 샌들", price: 420000, sku: "SH-SAND-01", description: "멀티 스트랩 샌들.", images: IMG.shoes(4), tags: [] },

    // PRADA 
    "605": { id: "605", category: "shoes", brand: "PRADA", name: "러너 스니커즈", price: 350000, sku: "SH-RUN-01", description: "경량 솔의 데일리 러너.", images: IMG.shoes(1), tags: [] },
    "606": { id: "606", category: "shoes", brand: "PRADA", name: "레더 로퍼", price: 520000, sku: "SH-LOAF-01", description: "풀그레인 레더 로퍼.", images: IMG.shoes(2), tags: [] },
    "607": { id: "607", category: "shoes", brand: "PRADA", name: "앵클 부츠", price: 890000, sku: "SH-BOOT-01", description: "사이드 지퍼 앵클 부츠.", images: IMG.shoes(3), tags: [] },
    "608": { id: "608", category: "shoes", brand: "PRADA", name: "트랙 샌들", price: 420000, sku: "SH-SAND-01", description: "멀티 스트랩 샌들.", images: IMG.shoes(4), tags: [] },

    // HERMES
    "609": { id: "609", category: "shoes", brand: "HERMES", name: "Lover 40 펌프스", price: 2130000, sku: "HT-65", description: "미니 버전으로 재해석한 아이코닉 Kelly 버클이 특징인 나파 가죽 소재의 슬링백 펌프스", images: IMG.shoes(1), tags: [] },
    "610": { id: "610", category: "shoes", brand: "HERMES", name: "Giulia 샌들", price: 1830000, sku: "YW-07", description: "아이코닉 Kelly 버클이 특징인 스웨이드 고트스킨 소재의 샌들", images: IMG.shoes(2), tags: [] },
    "611": { id: "611", category: "shoes", brand: "HERMES", name: "Kiara 40 펌프스", price: 2130000, sku: "CN-90", description: "아이코닉 Kelly 버클이 특징인 카프스킨 소재의 포인티드 토 펌프스", images: IMG.shoes(3), tags: [] },
    "612": { id: "612", category: "shoes", brand: "HERMES", name: "Luce 30 샌들", price: 1460000, sku: "QS-42", description: "가벼운 코르크 플랫폼과 아이코닉 H 컷아웃 디테일이 특징인 카프스킨 소재의 샌들", images: IMG.shoes(4), tags: [] },


    // CHANEL
    "613": { id: "613", category: "shoes", brand: "CHANEL", name: "코튼 트위드 슬링", price: 2281000, sku: "TD-91", description: "블랙", images: IMG.shoes(1), tags: [] },
    "614": { id: "614", category: "shoes", brand: "CHANEL", name: "램스킨 슬링", price: 1943000, sku: "VF-34", description: "아이보리, 블랙", images: IMG.shoes(2), tags: [] },
    "615": { id: "615", category: "shoes", brand: "CHANEL", name: "실크새틴 슬링", price: 2619000, sku: "QG-67", description: "라이트 핑크, 블랙", images: IMG.shoes(3), tags: [] },
    "616": { id: "616", category: "shoes", brand: "CHANEL", name: "유광 카프스킨 샌들", price: 2534000, sku: "NZ-25", description: "블랙", images: IMG.shoes(4), tags: [] }

  };

  w.MockData = {
    BRANDS,
    categoryBag,
    categoryAccessory,
    categoryBeauty,
    categoryTop,
    categoryBottoms,
    categoryShoes,
    productBag,
    productAccessory,
    productBeauty,
    productTop,
    productBottoms,
    productShoes,
  };
})(window);
