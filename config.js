// ============================================================
// 청첩장 설정 파일 — 이 파일의 값만 바꾸면 전체 내용이 바뀝니다.
// ============================================================
const CONFIG = {

  // 배경 음악 (BGM)
  bgm: {
    enabled: true,
    src: 'music/bgm.mp3', // 본인이 소유/사용권이 있는 음원 파일을 이 경로에 넣어주세요
    autoPlay: true,
  },

  // 카카오톡 공유 (developers.kakao.com 에서 발급받은 JavaScript 키를 넣으면 활성화됩니다)
  kakao: {
    appKey: '', // 예: '1234567890abcdef1234567890abcdef'
  },

  // 커버(인트로)
  intro: {
    mainImage: 'images/main.jpg',
    heroStyle: 'vintage', // 'vintage'(계단형 액자+필름사진) | 'arch'(아치형) | 'full'(풀스크린)
    groomName: '이병한',
    brideName: '노규민',
    groomNameEn: 'BYEONG HAN', // 국문 이름 아래에 영문 이름이 함께 표시됩니다 (비워두면 숨김)
    brideNameEn: 'GYU MIN',
    dateText: '2026년 12월 20일 일요일 오후 12시', // 오시는 길 섹션 상단에 표시됩니다
    venueShort: '천안 비렌티 웨딩홀 · 루체오홀',
    message:
      '함께 맞이하는 열 번째 겨울,\n' +
      '저희 두 사람 결혼합니다.\n\n' +
      '조용히 이어온 시간들이 깊이 스며들어\n' +
      '서로를 향한 흔들림 없는 확신이 되었습니다.\n\n' +
      '부부로서 나란히 함께하는 날,\n\n' +
      '귀한 걸음으로 축복해주시면\n' +
      '큰 기쁨으로 간직하겠습니다.',
  },

  // 부모님 정보
  parents: {
    groom: { father: '이상훈', mother: '이지영', relation: '장남' },
    bride: { father: '노상호', mother: '양경화', relation: '장녀' },
  },

  // 연락처 ("축하 연락하기" 버튼에서 노출)
  contacts: {
    groom: [
      { name: '이병한', relation: '신랑', phone: '010-0000-0001' },
      { name: '이상훈', relation: '아버님', phone: '010-0000-0002' },
      { name: '이지영', relation: '어머님', phone: '010-0000-0003' },
    ],
    bride: [
      { name: '노규민', relation: '신부', phone: '010-0000-0004' },
      { name: '노상호', relation: '아버님', phone: '010-0000-0005' },
      { name: '양경화', relation: '어머님', phone: '010-0000-0006' },
    ],
  },

  // 캘린더 / 디데이 (ISO 형식)
  calendar: {
    date: '2026-12-20T12:00:00+09:00',
  },

  // 예식 영상 (선택)
  video: {
    enabled: false,
    youtubeUrl: '', // 예: 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
  },

  // 갤러리
  gallery: Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/wedding-g${i + 1}/700/700`),

  // 오시는 길
  map: {
    name: '천안 비렌티 웨딩홀 · 루체오홀',
    address: '충남 천안시 서북구 천안대로 1198-30',
    lat: 36.8267, // 도로명주소 기준 근사치입니다. 정확한 핀 위치가 필요하면 네이버지도에서 좌표를 확인해 조정해 주세요.
    lng: 127.1529,
    transport: {
      car:
        '① 천안IC 진출 후 평택/천안아산역 방향으로 고가 진입\n' +
        '② 천안터널 통과 후 평택/성환 방면 고가 옆길로 진입하여 곧바로 우회전\n' +
        '③ 평택방향으로 직진 후 육교 지나서 300m 전방에 비렌티웨딩홀 입구 안내 보이면 우회전',
      subway: '',
      bus:
        '성환방면 100번대 버스 이용 후 천안공주대학교에서 하차 후 도보5분\n' +
        '천안역(양지문고 앞) 100번, 110번, 112번, 82번\n' +
        '터미널(신세계백화점 앞) 112번, 140번, 141번, 143번, 144번, 145번, 150번, 151번',
      shuttle:
        '천안종합터미널-신세계백화점(아라리오 광장) 올리브영&스타벅스 건물 앞 횡단보도\n' +
        '두정역 입구 오른쪽 50m지점 셔틀버스 승강장\n' +
        '※ 예식시간 1시간 전부터 30분 간격으로 셔틀버스 이용 가능\n' +
        '※ 고속버스터미널 → 두정역 → 비렌티웨딩홀\n' +
        '※ 자세한 운영 시간은 문의 예약실 041-554-5500',
      parking: '',
    },
  },

  // 안내사항 (자유롭게 추가/삭제 가능)
  information: [
    { title: '식사 안내', content: '2층 연회장에서 뷔페로 준비되어 있습니다.\n식권은 로비 안내데스크에서 수령해 주세요.' },
    { title: '화환 안내', content: '화환은 정중히 사양하고 있습니다.\n따뜻한 마음만으로 축하해 주세요.' },
  ],

  // 마음 전하실 곳
  accounts: {
    groom: [
      { name: '신랑 이병한', bank: '카카오뱅크', number: '3333-01-0000000' },
      { name: '아버지 이상훈', bank: '국민은행', number: '000000-00-000000' },
    ],
    bride: [
      { name: '신부 노규민', bank: '신한은행', number: '000-000-000000' },
      { name: '어머니 양경화', bank: '우리은행', number: '0000-000-000000' },
    ],
  },

  // RSVP (구글 시트 연동 — README 참고해 Apps Script 배포 후 endpoint를 채워주세요)
  rsvp: {
    enabled: true,
    endpoint: '', // 예: 'https://script.google.com/macros/s/AKfycb.../exec'
  },

  // 공유하기 / 카카오톡 카드용 정보
  share: {
    title: '병한 ♥ 규민 결혼합니다',
    description: '2026년 12월 20일 일요일 오후 12시, 천안 비렌티 웨딩홀에서 결혼식을 올립니다.',
    kakaoThumbnail: 'https://wedding-invitation-kappa-three-94.vercel.app/images/main.jpg',
  },
};
