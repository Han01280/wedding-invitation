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
    appKey: 'a0f929753500122457749aed8d5f67f8',
  },

  // 네이버 지도 미리보기 (NCP - AI·NAVER API 콘솔에서 발급받은 Client ID)
  naver: {
    clientId: 'as2xbg8dov',
  },

  // 커버(인트로)
  intro: {
    mainImage: 'images/main.jpg',
    heroStyle: 'vintage', // 'vintage'(계단형 액자+필름사진) | 'arch'(아치형) | 'full'(풀스크린)
    groomName: '이병한',
    brideName: '노규민',
    groomNameEn: 'BYEONG HAN', // 국문 이름 아래에 영문 이름이 함께 표시됩니다 (비워두면 숨김)
    brideNameEn: 'GYU MIN',
    dateText: '2026년 12월 20일 일요일 낮 12시', // Wedding Day 섹션 상단에 표시됩니다
    venueShort: '천안 비렌티 웨딩홀\n신관 3층 · 루체오홀',
    message: [
      '함께 맞이하는 열 번째 겨울,\n저희 두 사람 결혼합니다.',
      '조용히 이어온 시간들이 깊이 스며들어\n서로를 향한 흔들림 없는 확신이 되었습니다.',
      '부부로서 나란히 함께하는 날,',
      '귀한 걸음으로 축복해주시면\n큰 기쁨으로 간직하겠습니다.',
    ],
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
    name: '천안 비렌티 웨딩홀 · 신관 3층 루체오홀',
    address: '충남 천안시 서북구 천안대로 1198-30',
    lat: 36.847863, // 카카오맵 장소 검색(비렌티웨딩홀)으로 확인한 정확한 좌표
    lng: 127.159087,
    transport: {
      shuttle: {
        steps: [
          { text: '천안종합터미널', sub: '아라리오갤러리 올리브영 & 스타벅스 앞 횡단보도' },
          { text: '두정역', sub: '1번 출구 우측 50m 지점 파란색 셔틀버스 승강장' },
        ],
        notes: [
          '예식시간 1시간 전부터 30분 간격으로 셔틀버스 이용 가능',
          '천안종합터미널 ▶ 두정역 ▶ 비렌티웨딩홀',
        ],
      },
      bus: {
        steps: [
          { text: '천안역 (이태리안경 앞)', sub: '100번, 110번' },
          { text: '천안고속버스터미널 (맥도날드 앞)', sub: '112번, 140번, 143번, 145번, 151번' },
        ],
        notes: [
          '[공주대 공과대학] 정류장 하차 후 도보 10분',
        ],
      },
    },
  },

  // 안내사항 (자유롭게 추가/삭제 가능)
  information: [
    { title: '', content: '2층 연회장에 뷔페가 준비되어 있습니다.\n식권은 축의대에서 수령해 주세요.' },
  ],

  // 마음 전하실 곳
  accounts: {
    groom: [
      { name: '신랑 이병한', bank: '카카오뱅크', number: '3333-01-0000000' },
      { name: '아버지 이상훈', bank: '국민은행', number: '000000-00-000000' },
      { name: '어머니 이지영', bank: '국민은행', number: '000000-00-000000' },
    ],
    bride: [
      { name: '신부 노규민', bank: '신한은행', number: '000-000-000000' },
      { name: '어머니 양경화', bank: '우리은행', number: '0000-000-000000' },
      { name: '아버지 노상호', bank: '우리은행', number: '0000-000-000000' },
    ],
  },

  // RSVP (구글 시트 연동 — README 참고해 Apps Script 배포 후 endpoint를 채워주세요)
  rsvp: {
    enabled: true,
    endpoint: 'https://script.google.com/macros/s/AKfycbwz7TVyMNo4hJtc-6FlpsFdijbyt3OraXdjsV3GLz9a11zLVu2_j7Xek8px8hQhGRkR/exec',
  },

  // 공유하기 / 카카오톡 카드용 정보
  share: {
    title: '병한 ♥ 규민 결혼합니다',
    description: '2026년 12월 20일 일요일 오후 12시, 천안 비렌티 웨딩홀에서 결혼식을 올립니다.',
    kakaoThumbnail: 'https://wedding-invitation-kappa-three-94.vercel.app/images/kakao-cover-v2.jpg',
  },
};
